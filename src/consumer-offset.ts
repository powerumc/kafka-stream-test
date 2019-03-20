import { connect } from "./common";
import { Offset } from "kafka-node";

async function listenConsumer(client, topicName): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const offset = new Offset(client);
        offset.on("connect", () => { console.log("connect"); });
        offset.on("error", (error) => { console.error(error); });
        offset.on("ready", () => { console.log("ready"); });

        setInterval(() => {
            offset.fetch([
                {
                    maxNum: 5,
                    time: Date.now(),
                    topic: topicName,
                }], (error, data) => {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    console.log(data);

                    const key = Object.keys(data.test)[0];
                    offset.commit("test-group", [{
                        topic: topicName,
                        offset: data.test[key][0]
                    }], (error, data) => { console.log(data); });
                });
        }, 2000);
    });
}

(async () => {
    const client = await connect();
    await listenConsumer(client, "test");
})();