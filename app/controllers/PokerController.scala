package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.poker.util.Evaluator
import de.htwg.poker.controller.Controller
import de.htwg.poker.model.GameState
import play.api.libs.json._

/** This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class PokerController @Inject() (val controllerComponents: ControllerComponents)
    extends BaseController {

  val gameController = new Controller(
    new GameState(Nil, None, None, 0, 0, Nil, 0, 0, 0, 0)
  )
  def pokerAsText = gameController.toString()
  def gameState = gameController.gameState

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def newGame() = Action { implicit request: Request[AnyContent] =>
    val players =
      List("Player1", "Player2", "Player3", "Player4", "Player5", "Player6")
    gameController.createGame(players, "10", "20")
    Ok(views.html.poker(gameState))
  }

  def bet(amount: Int) = Action { implicit request: Request[AnyContent] =>
    gameController.bet(amount)
    val updatedGameJson = gameStateToJson()
    Ok(updatedGameJson).as("application/json")
  }

  def allIn() = Action { implicit request: Request[AnyContent] =>
    gameController.allIn()
    val updatedGameJson = gameStateToJson()
    Ok(updatedGameJson).as("application/json")
  }

  def fold() = Action { implicit request: Request[AnyContent] =>
    gameController.fold
    val updatedGameJson = gameStateToJson()
    Ok(updatedGameJson).as("application/json")
  }

  def call() = Action { implicit request: Request[AnyContent] =>
    println("PokerController.call() function called")
    gameController.call
    Ok(gameStateToJson()).as("application/json")
  }

  def check() = Action { implicit request: Request[AnyContent] =>
    gameController.check
    val updatedGameJson = gameStateToJson()
    Ok(updatedGameJson).as("application/json")
  }

  def restartGame = Action { implicit request: Request[AnyContent] =>
    gameController.restartGame
    val updatedGameJson = gameStateToJson()
    Ok(updatedGameJson).as("application/json")
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
}
