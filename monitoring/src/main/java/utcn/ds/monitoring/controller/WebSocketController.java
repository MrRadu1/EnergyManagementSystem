package utcn.ds.monitoring.controller;

import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import utcn.ds.monitoring.domain.HourMeasurement;

@Controller
@CrossOrigin("http://localhost:3000")
public class WebSocketController {

    private final SimpMessagingTemplate simpMessageTemplate;

    public WebSocketController(SimpMessagingTemplate simpMessageTemplate) {
        this.simpMessageTemplate = simpMessageTemplate;
    }

    @MessageMapping("/notification")
    @SendTo("/topic/message")
    public void send(@Payload String message) {
        simpMessageTemplate.convertAndSend("/topic/message", message);
    }
}
