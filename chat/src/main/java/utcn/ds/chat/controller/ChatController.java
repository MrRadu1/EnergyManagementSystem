package utcn.ds.chat.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import utcn.ds.chat.domain.Message;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final SimpMessagingTemplate simpMessageTemplate;

    public ChatController(SimpMessagingTemplate simpMessageTemplate) {
        this.simpMessageTemplate = simpMessageTemplate;
    }

    @GetMapping("/get")
    public ResponseEntity<?> mesgTest(){
        Message message = new Message();
        long time = System.currentTimeMillis();
        message.setTimestamp(time);
        message.setSender("Admin");
        message.setReceiver("sa");
        message.setMessage("salut test");
        simpMessageTemplate.convertAndSendToUser("sa", "/message", message);
        return ResponseEntity.ok(message);
    }

    @MessageMapping("/chat/message/admin")
    public Message sendMessageToAdmin(@Payload Message message){
        simpMessageTemplate.convertAndSend("/chat/message/admin", message);
        return message;
    }

    @MessageMapping("/chat/{username}/typing")
    public String sendTypingNotificationToUser(@Payload String message, @DestinationVariable("username") String username){
        simpMessageTemplate.convertAndSendToUser(username, "/typing", message);
        return message;
    }

    @MessageMapping("/chat/{username}/readReceipt")
    public String sendReadReceiptToUser(@Payload String message, @DestinationVariable("username") String username){
        simpMessageTemplate.convertAndSendToUser(username, "/readReceipt", message);
        return message;
    }

    @MessageMapping("/chat/admin/typing")
    public String sendTypingNotificationToAdmin(@Payload String message){
        simpMessageTemplate.convertAndSend("/chat/admin/typing", message);
        return message;
    }

    @MessageMapping("/chat/admin/stoppedTyping")
    public String sendStoppedTypingNotificationToAdmin(@Payload String message){
        simpMessageTemplate.convertAndSend("/chat/admin/stoppedTyping", message);
        return message;
    }

    @MessageMapping("/chat/{username}/stoppedTyping")
    public String sendStoppedTypingNotificationToUser(@Payload String message, @DestinationVariable("username") String username){
        simpMessageTemplate.convertAndSendToUser(username, "/stoppedTyping", message);
        return message;
    }


    @MessageMapping("/chat/{username}/message")
    public Message sendMessageToUser(@Payload Message message, @DestinationVariable("username") String username){
        simpMessageTemplate.convertAndSendToUser(username, "/message", message);
        return message;
    }
}
