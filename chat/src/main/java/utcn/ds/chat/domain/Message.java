package utcn.ds.chat.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class Message {
    public String message;
    public String sender;
    public String receiver;
    private long timestamp;
}