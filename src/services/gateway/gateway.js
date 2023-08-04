import amqp from "amqplib"
import express from "express"
import { v4 as uuid } from "uuid"
import {pino} from "pino"


const logger = pino()

const app = express()
app.use(express.json())
app.get("/shoes", async (req, res) => {
	logger.info("New shoes request")
	const queue = "shoes"
	const id = uuid()
	let connection
	try {
		connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672/")
		const channel = await connection.createChannel()
		await channel.assertQueue(queue, { exclusive: true })

		channel.sendToQueue(
			"rpc_shoes",
			Buffer.from(JSON.stringify({ msg: "shoes" })),
			{ replyTo: queue, correlationId: id }
		)
		await channel.consume(
			queue,
			(msg) => {
	logger.info("Shoe service responded")

				if (msg.properties.correlationId === id) {
					const shoesData = JSON.parse(msg.content.toString())
					res.json(shoesData)
				}
			},
			{ noAck: true }
		)

		await channel.close()
	} catch (err) {
		logger.error(err ,"Error occured during shoe request handling")
	} finally {
		if (connection) {
			await connection.close()
			logger.info("Gateway disconnected from RabbitMQ")
		}
	}
})

app.listen(4000, () => {
	console.log(`Started on port 4000`)
})
