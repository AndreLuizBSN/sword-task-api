import { Kafka, Partitioners } from "kafkajs";

const clientId = 'task-app';
const brokers = ["broker:9092"];
const topic = 'message-log';
const kafka = new Kafka({clientId, brokers, });
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

export const produce =async () => {
  console.log("Called produce");
  
  await producer.connect();
  let i = 0;

  setInterval(async () => {
    try {
      await producer.send({
        topic,
        messages: [{
          key: String(i),
          value: "this is message " + i
        }]
      })
      console.log('Write: ' + i);
      i++;
    } catch (error) {
      console.error(error);      
    }
  })
}

/*
export const startProducer = async (msg: string) => {
  const kafka = new Kafka({
    clientId: "task-app",
    brokers: ["localhost:9092"], // url 'kafka' is the host and port is 9092
  });

  const producer = kafka.producer();
  // Producing
  await producer.connect();

  await producer.send({
    topic: "test-topic",
    messages: [{ value: msg }],
  });

  await producer.disconnect();

};
*/