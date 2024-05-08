package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.poker.util.Evaluator
import de.htwg.poker.controller.Controller

/** This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject() (val controllerComponents: ControllerComponents) extends BaseController {

  val gameController = new Controller()
  def pokerAsText = gameController.toString()


  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def newGame() = Action { implicit request: Request[AnyContent] =>
    val players = List("Player1", "Player2", "Player3", "Player4")
    gameController.createGame(players,10,20)
    Ok(views.html.index(pokerAsText))
  }
}
