package controllers

import views._
import play.api.mvc._
import play.api.Logger
import play.api.Play
import play.api.libs.iteratee.Iteratee
import play.api.libs.iteratee.Enumerator
import com.codahale.jerkson._
import scala.collection.mutable.HashMap


object MainPage extends Controller {
 def home = Action {
    Ok(html.main())
 }
 
 val speech = {
   val m = new HashMap[String,String]
   
   m.put("A", "")
   m.put("B", "Ceci est un texte...")
   m
 }
 
 def poll = Action {
    Ok(Json.generate(speech))
 }
 
 def participantTable(tableId: String) = Action {
    Ok(html.participant(tableId))
 }
 
 def update(tableId: String) = Action(BodyParsers.parse.tolerantText) { req =>
   speech.put(tableId, req.body)
   Ok
 }
}
