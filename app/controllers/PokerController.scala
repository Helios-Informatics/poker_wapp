package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.poker.util.Evaluator
import de.htwg.poker.controller.Controller
import de.htwg.poker.model.GameState
import play.api.libs.json._

import org.apache.pekko.stream.Materializer
import org.apache.pekko.actor._
import play.api.libs.streams.ActorFlow
import scala.collection.immutable.VectorMap
import scala.swing.event.Event
import scala.swing.Reactor
import scala.collection.immutable.ListMap

/** This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class PokerController @Inject() (
    val controllerComponents: ControllerComponents,
    implicit val system: ActorSystem,
    implicit val mat: Materializer
) extends BaseController {

  val gameController = new Controller(
    new GameState(Nil, None, None, 0, 0, Nil, 0, 0, 0, 0)
  )

  val pokerControllerPublisher = new PokerControllerPublisher(gameController)


  // lobby
  var players: ListMap[String, String] = ListMap()
  var smallBlind: Int = 10
  var bigBlind: Int = 20

  var isLobby = false

  def pokerAsText = pokerControllerPublisher.toString()
  def gameState = pokerControllerPublisher.gameState

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def singleplayer() = Action { implicit request: Request[AnyContent] =>
    isLobby = false
    val players =
      List("Player1", "Player2", "Player3", "Player4", "Player5", "Player6")
    pokerControllerPublisher.createGame(players, "10", "20")
    Ok(views.html.poker(gameState))
  }

  def newGame(): Action[JsValue] = Action(parse.json) { implicit request =>
    isLobby = false
    val gameConfigResult = request.body.validate[GameConfig]

    gameConfigResult.fold(
      errors => {
        BadRequest(Json.obj("status" -> "error", "message" -> JsError.toJson(errors)))
      },
      gameConfig => {
        pokerControllerPublisher.createGame(gameConfig.players, gameConfig.smallBlind, gameConfig.bigBlind)
        val updatedGameJson = gameStateToJson()
        Ok(views.html.poker(gameState)).as("text/html")
      }
    )
  }

  def bet(amount: Int) = Action { implicit request: Request[AnyContent] =>
    pokerControllerPublisher.bet(amount)
    val updatedGameJson = gameStateToJson()
    Ok(updatedGameJson).as("application/json")
  }

  def allIn() = Action { implicit request: Request[AnyContent] =>
    pokerControllerPublisher.allIn()
    val updatedGameJson = gameStateToJson()
    Ok(updatedGameJson).as("application/json")
  }

  def fold() = Action { implicit request: Request[AnyContent] =>
    pokerControllerPublisher.fold()
    val updatedGameJson = gameStateToJson()
    Ok(updatedGameJson).as("application/json")
  }

  def call() = Action { implicit request: Request[AnyContent] =>
    println("PokerController.call() function called")
    pokerControllerPublisher.call()
    Ok(gameStateToJson()).as("application/json")
  }

  def check() = Action { implicit request: Request[AnyContent] =>
    pokerControllerPublisher.check()
    val updatedGameJson = gameStateToJson()
    Ok(updatedGameJson).as("application/json")
  }

  def restartGame() = Action { implicit request: Request[AnyContent] =>
    pokerControllerPublisher.restartGame()
    val updatedGameJson = gameStateToJson()
    Ok(updatedGameJson).as("application/json")
  }

  // lobby functions
  def join() = Action { implicit request: Request[AnyContent] =>
    println("Joining lobby")
    isLobby = true

    val playerID = request.headers.get("playerID").getOrElse("")
    val playersLength = players.toList.length

    if( playerID == "") {
      print("Could not receive playerID")
      Ok(views.html.index())

    } else if (players.contains(playerID)) {
      println("Player already in lobby")
      val updatedLobbyJson = lobbyToJson()
      Ok(updatedLobbyJson).as("application/json")

    } else if (playersLength >= 6) {
      print("Player limit reached")
      Ok(views.html.index())
      
    } else {
      val newPlayerName = "Player" + (playersLength + 1)
      players = players + (playerID -> newPlayerName)

      pokerControllerPublisher.lobby()

      println("New Player: " + playerID + " " + newPlayerName)

      val updatedLobbyJson = lobbyToJson()
      Ok(updatedLobbyJson).as("application/json")
    }

  }


  case class GameConfig(players: List[String], smallBlind: String, bigBlind: String)
  object GameConfig {
    implicit val gameConfigFormat: Format[GameConfig] = Json.format[GameConfig]
  }

    def getJson = Action {
    Ok(gameStateToJson())
  }

  def gameStateToJson() = {
    Json.obj(
      "players" -> gameState.getPlayers.map { player =>
        Json.obj(
          "player" -> Json.obj(
            "card1rank" -> player.card1.rank.toString,
            "card1suit" -> player.card1.suit.id,
            "card2rank" -> player.card2.rank.toString,
            "card2suit" -> player.card2.suit.id,
            "playername" -> player.playername,
            "balance" -> player.balance,
            "currentAmountBetted" -> player.currentAmountBetted,
            "folded" -> player.folded
          )
        )
      },
      "playerAtTurn" -> gameState.getPlayerAtTurn,
      "highestBetSize" -> gameState.getHighestBetSize,
      "board" -> gameState.getBoard.map { card =>
        Json.obj(
          "card" -> Json.obj(
            "rank" -> card.rank.toString,
            "suit" -> card.suit.id
          )
        )
      },
      "pot" -> gameState.getPot
    )
  }

  def lobbyToJson() = {
    Json.obj(
      "players" -> players,
      "smallBlind" -> smallBlind,
      "bigBlind" -> bigBlind
    )
  }

  def socket(): WebSocket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      println("Connect received")
      PokerWebSocketActorFactory.create(out)
    }
  }
  object PokerWebSocketActorFactory {
    def create(out: ActorRef) =
      Props(new PokerWebSocketActor(out))
  }

  class PokerWebSocketActor(out: ActorRef) extends Actor with Reactor {

    listenTo(pokerControllerPublisher)

    def receive: Receive = { case msg: String =>
      if (isLobby) {
        out ! lobbyToJson().toString()
      } else {
        out ! gameStateToJson().toString()
      }
      println("Received: " + msg)
    }

    reactions += { case _ =>
      sendJsonToClient()
    }

    def sendJsonToClient() = {
      if (isLobby) {
        out ! lobbyToJson().toString()
      } else {
        out ! gameStateToJson().toString()
      }
    }

  }
}
