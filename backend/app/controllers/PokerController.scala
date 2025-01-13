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

import scala.concurrent.duration._

/** This controller creates an Action to handle HTTP requests to the
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

  def newGame() = Action { implicit request: Request[AnyContent] =>
    Evaluator.readHashes
    isLobby = false

    pokerControllerPublisher.createGame(
      players.keys.toList,
      smallBlind.toString,
      bigBlind.toString
    )
    val updatedPokerJson = pokerToJson()
    Ok(updatedPokerJson).as("application/json")
  }

  def bet(amount: Int) = Action { implicit request: Request[AnyContent] =>
    pokerControllerPublisher.bet(amount)
    val updatedPokerJson = pokerToJson()
    Ok(updatedPokerJson).as("application/json")
  }

  def allIn() = Action { implicit request: Request[AnyContent] =>
    pokerControllerPublisher.allIn()
    val updatedPokerJson = pokerToJson()
    Ok(updatedPokerJson).as("application/json")
  }

  def fold() = Action { implicit request: Request[AnyContent] =>
    pokerControllerPublisher.fold()
    val updatedPokerJson = pokerToJson()
    Ok(updatedPokerJson).as("application/json")
  }

  def call() = Action { implicit request: Request[AnyContent] =>
    println("PokerController.call() function called")
    pokerControllerPublisher.call()
    Ok(pokerToJson()).as("application/json")
  }

  def check() = Action { implicit request: Request[AnyContent] =>
    pokerControllerPublisher.check()
    val updatedPokerJson = pokerToJson()
    Ok(updatedPokerJson).as("application/json")
  }

  def restartGame() = Action { implicit request: Request[AnyContent] =>
    pokerControllerPublisher.restartGame()
    val updatedPokerJson = pokerToJson()
    Ok(updatedPokerJson).as("application/json")
  }

  // lobby functions
  def join() = Action { implicit request: Request[AnyContent] =>
    println("Joining lobby")
    isLobby = true

    val playerID = request.headers.get("playerID").getOrElse("")
    val playersLength = players.toList.length

    println("playerrs: " + players)
    println("playerID: " + playerID)

    if (playerID == "") {
      BadRequest("Error: playerID is missing")

    } else if (players.values.toList.contains(playerID)) {
      println("Player already in lobby")
      val updatedPokerJson = pokerToJson()
      Ok(updatedPokerJson).as("application/json")

    } else if (playersLength >= 6) {
      BadRequest("Error: Player limit reached")
    } else {
      val newPlayerName = "Player" + (playersLength + 1)
      players = players + (newPlayerName -> playerID)


      pokerControllerPublisher.lobby()

      println("New Player: " + playerID + " " + newPlayerName)

      val updatedPokerJson = pokerToJson()
      Ok(updatedPokerJson).as("application/json")
    }

  }

  def leave() = Action { implicit request: Request[AnyContent] =>
    isLobby = true;
    pokerControllerPublisher.leave()
    val updatedPokerJson = pokerToJson()
    Ok(updatedPokerJson).as("application/json")
  }

  def leaveLobby() = Action { implicit request: Request[AnyContent] =>
    println("Leaving lobby")
    val playerID = request.headers.get("playerID").getOrElse("")
    
    println("players: " + players)
    println("playerID: " + playerID)
    
    if (playerID == "") {
      BadRequest("Error: playerID is missing")
    } else if (!players.values.toList.contains(playerID)) {
      println("Player not in lobby")
      BadRequest("Error: Player not in lobby")
    } else {
      players = players.filterNot { case (_, id) => id == playerID }
    
      if (players.isEmpty) {
        isLobby = false
      }
    
      pokerControllerPublisher.lobby()
    
      println("Player removed: " + playerID)
    
      val updatedPokerJson = pokerToJson()
      Ok(updatedPokerJson).as("application/json")
  }
}

  case class GameConfig(
      players: List[String],
      smallBlind: String,
      bigBlind: String
  )
  object GameConfig {
    implicit val gameConfigFormat: Format[GameConfig] = Json.format[GameConfig]
  }

  def getJson = Action {
    Ok(pokerToJson())
  }

  def pokerToJson() = {
    Json.obj(
      "isLobby" -> isLobby,
      "lobbyPlayers" -> players,
      "smallBlind" -> smallBlind,
      "bigBlind" -> bigBlind,
      "players" -> gameState.getPlayers.zipWithIndex.map { case (player, index) =>
        Json.obj(
          "player" -> Json.obj(
            "id" -> players.getOrElse(player.playername, ""),
            "card1rank" -> player.card1.rank.toString,
            "card1suit" -> player.card1.suit.id,
            "card2rank" -> player.card2.rank.toString,
            "card2suit" -> player.card2.suit.id,
            "playername" -> player.playername,
            "balance" -> player.balance,
            "currentAmountBetted" -> player.currentAmountBetted,
            "folded" -> player.folded,
            "handEval" -> gameState.getHandEval(index)
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

  def socket(): WebSocket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      println("Connect received NEW")
      PokerWebSocketActorFactory.create(out)
    }
  }
  object PokerWebSocketActorFactory {
    def create(out: ActorRef) =
      Props(new PokerWebSocketActor(out))
  }

  class PokerWebSocketActor(out: ActorRef) extends Actor with Reactor {
    import context.dispatcher

  listenTo(pokerControllerPublisher)

  // Scheduler für Pings
    val pingScheduler = context.system.scheduler.scheduleAtFixedRate(
      initialDelay = 5.seconds,
      interval = 5.seconds,
      receiver = self,
      message = "sendPing"
    )

    // Zeitstempel der letzten Pong-Antwort
    var lastPongReceived: Long = System.currentTimeMillis()

  def receive: Receive = { 

      case "sendPing" =>
      out ! "ping" // Sende Ping an den Client
      // Prüfe, ob der Client innerhalb des Zeitlimits geantwortet hat
      if (System.currentTimeMillis() - lastPongReceived > 10000) { // Timeout: 5 Sekunden
        println(s"No pong received from $playerID, closing connection")
        if (!offlinePlayers.contains(playerID)) {
            disconnected(playerID);
            if (offlinePlayerIsAtTurn) {
              println("triggering fold because player offline")
              pokerControllerPublisher.fold()
            }
        }
      }

    case "pong" =>
      println(s"Pong received from $playerID")
      lastPongReceived = System.currentTimeMillis() // Zeitstempel aktualisieren
      if (offlinePlayers.contains(playerID)) {
            reconnected(playerID);
        }

    case msg: String =>
      out ! pokerToJson().toString()
    }

  reactions += { case _ =>
    sendJsonToClient()
  }

  def sendJsonToClient() = {
    out ! pokerToJson().toString()
  }
}
}
