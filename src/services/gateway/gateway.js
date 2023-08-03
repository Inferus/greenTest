import amqp from "amqplib"
import express from "express"
import dotenv from "dotenv"
import { v4 as uuid } from "uuid"
import pino from "pino"

dotenv.config()

const app = express()
app.use(express.json())
app.get("/shoes", async (req, res) => {
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
				console.log("object")
				if (msg.properties.correlationId === id) {
					const shoesData = JSON.parse(msg.content.toString())
					res.json(shoesData)
				}
			},
			{ noAck: true }
		)

		await channel.close()
	} catch (err) {
		console.warn(err)
	} finally {
		if (connection) await connection.close()
	}
})

app.listen(4000, () => {
	console.log(`Started on port 4000`)
})
