package utcn.ds.monitoring.configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import utcn.ds.monitoring.listeners.DeviceListener;
import utcn.ds.monitoring.listeners.MeasurementListener;

@Configuration
public class RabbitConfiguration {

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    @Qualifier("measurementQueue")
    public Queue measurementsQueue() {
        return new Queue("measurementQueue");
    }

    @Bean
    @Qualifier("deviceQueue")
    public Queue deviceQueue() {
        return new Queue("deviceQueue");
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange("exchange");
    }

    @Bean
    public Binding measurementBinding(@Qualifier("measurementQueue") Queue queue, TopicExchange exchange) {
        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with("measurement_routingKey");
    }


    @Bean
    public Binding deviceBinding(@Qualifier("deviceQueue") Queue queue, TopicExchange exchange) {
        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with("device_routingKey");
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter);
        return rabbitTemplate;
    }
    @Bean
    public MessageListenerAdapter measurementsListenerAdapter(MeasurementListener measurementsListener, Jackson2JsonMessageConverter jsonMessageConverter ) {
        MessageListenerAdapter messageListenerAdapter =
                new MessageListenerAdapter(measurementsListener, "receiveMeasurement");
        messageListenerAdapter.setMessageConverter(jsonMessageConverter);
        return messageListenerAdapter;
    }

    @Bean
    public MessageListenerAdapter deviceListenerAdapter(DeviceListener deviceListener, Jackson2JsonMessageConverter jsonMessageConverter) {
        MessageListenerAdapter messageListenerAdapter =
                new MessageListenerAdapter(deviceListener, "receiveDevice");
        messageListenerAdapter.setMessageConverter(jsonMessageConverter);
    return messageListenerAdapter;
    }

    @Bean
    public SimpleMessageListenerContainer measurementsContainer(ConnectionFactory connectionFactory, MessageListenerAdapter measurementsListenerAdapter) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames("measurementQueue");
        container.setMessageListener(measurementsListenerAdapter);
        return container;
    }

    @Bean
    public SimpleMessageListenerContainer deviceContainer(ConnectionFactory connectionFactory, MessageListenerAdapter deviceListenerAdapter) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames("deviceQueue");
        container.setMessageListener(deviceListenerAdapter);
        return container;
    }

}
