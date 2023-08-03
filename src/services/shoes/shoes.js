import amqp from "amqplib"

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

const recievequeue = "rpc_shoes"

;(async () => {
	try {
		const connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672/")
		const channel = await connection.createChannel()

		await channel.assertQueue(recievequeue, { durable: false })
		channel.prefetch(1)
		channel.consume(
			recievequeue,
			(message) => {
				console.log(message.content.toString())
				channel.sendToQueue(
					message.properties.replyTo,
					Buffer.from(JSON.stringify({ shoes: SHOES })),
					{ correlationId: message.properties.correlationId }
				)
			},
			{ noAck: true }
		)
	} catch (err) {
		console.warn("Error: ", err)
	}
})()
