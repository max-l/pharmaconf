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
    Ok(html.home())
 }
 
 def conferencier = Action {
    Ok(html.main())
 }
 
 val conference = new HashMap[ConfSlot,SlotState]

 def poll = Action {
   val ser = conference.synchronized(conference.map { e =>
     MsgPacked(e._1.questionId, e._1.tableId, e._2.text, e._2.ended, e._2.rational)
   }) 
   Ok(Json.generate(ser))
 }
 
 def participantTable(tableId: String) = Action {
   
    val ser = conference.synchronized(conference.filter(e => e._1.tableId == tableId).map { e =>
      MsgPacked(e._1.questionId, e._1.tableId, e._2.text, e._2.ended, e._2.rational)
    })

    Ok(html.participant(tableId, Json.generate(ser)))
 }

 def reset = Action {
     conference.synchronized {
       conference.clear
     }   
    Ok
 }

 def update = Action(BodyParsers.parse.tolerantText) { req =>
   
   val msg = Json.parse[MsgPacked](req.body)
   val up = msg.unpack
     conference.synchronized {
       conference.put(up.cs, up.ss)
     }
   Ok
 }
}


case class Msg(cs: ConfSlot, ss: SlotState)

case class ConfSlot(questionId: Int, tableId: String)

case class SlotState(text: String, ended: Boolean, rational: String)


case class MsgPacked(questionId: Int, tableId: String, text: String, ended: Boolean, rational: String) {
  def unpack = Msg(ConfSlot(questionId, tableId), SlotState(text, ended, rational))
}
