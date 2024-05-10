package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.poker.util.Evaluator
import de.htwg.poker.controller.Controller
import de.htwg.poker.model.GameState

/** This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject() (val controllerComponents: ControllerComponents)
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
    Ok(views.html.poker(gameState))
  }

  def allIn() = Action { implicit request: Request[AnyContent] =>
    gameController.allIn()
    Ok(views.html.poker(gameState))
  }

  def fold() = Action { implicit request: Request[AnyContent] =>
    gameController.fold
    Ok(views.html.poker(gameState))
  }

  def call() = Action { implicit request: Request[AnyContent] =>
    gameController.call
    Ok(views.html.poker(gameState))
  }

  def check() = Action { implicit request: Request[AnyContent] =>
    gameController.check
    Ok(views.html.poker(gameState))
  }

  def restartGame = Action { implicit request: Request[AnyContent] =>
    gameController.restartGame
    Ok(views.html.poker(gameState))
  }
}
