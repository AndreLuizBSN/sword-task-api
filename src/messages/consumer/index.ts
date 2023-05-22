import { Kafka } from 'kafkajs';

const clientId = 'task-app';
const brokers = ["broker:9092"];
const topic = 'message-log';
const kafka = new Kafka({clientId, brokers});
const consumer = kafka.consumer({groupId: clientId});

export const consume =async () => {
  await consumer.connect();
  await consumer.subscribe({topic});
  await consumer.run({
    eachMessage: async ({message}) => {
      console.log("Recieve message " + message);
    }
  })
}


/*const kafka = new Kafka({
    clientId: "task-app",
    connectionTimeout: 450000,
    brokers: ["localhost:9092"], // url 'kafka' is the host and port is 9092
});

const consumer = kafka.consumer({ groupId: 'topic-test-1-group' });

consumer.connect();
consumer.subscribe({ topic: 'topic-test-1', fromBeginning: true });

consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      value: message?.value?.toString(),
    });
  },
});
*/