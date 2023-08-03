import amqp from "amqplib"

import {pino} from "pino"

const SHOES = [
	{
		id: 1,
		name: "Nike",
	},
	{
		id: 2,
		name: "Adidas",
	},
	{
		id: 3,
		name: "Puma",
	},
]

const logger = pino()

const recievequeue = "rpc_shoes"

;(async () => {
	try {
		const connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672/")
		const channel = await connection.createChannel()
		logger.info("Shoe service connected to RabbitMQ")
		await channel.assertQueue(recievequeue, { durable: false })
		channel.prefetch(1)
		channel.consume(
			recievequeue,
			(message) => {
		logger.info(message.content.toString(),"Shoe service recieved a message")

				channel.sendToQueue(
					message.properties.replyTo,
					Buffer.from(JSON.stringify({ shoes: SHOES })),
					{ correlationId: message.properties.correlationId }
				)
			},
			{ noAck: true }
		)
	} catch (err) {
		logger.error(err,"Shoe service error")
	}
})()
