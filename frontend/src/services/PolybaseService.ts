import { CollectionList, Polybase } from "@polybase/client";
import { nanoid } from "nanoid";

export default class PolybaseService {
  static db = new Polybase({
    defaultNamespace:
      "pk/0xd5ba40aff8360200c802895e2106a9a8b809f99be35fcdf4d751e516256b17307afba149f48c1a8f4dde171cf43b6c225ec42cc641fda45894ab73ca5b4c738e/DAO-Fetcher",
  });

  static isInitialized = false;

  static async init() {
    if (PolybaseService.isInitialized) return;

    try {
      await this.db.applySchema(
        `
        @public
        collection ConversationMessages {
          id: string;
          protocolId: string;
          userId: string;
          actor: string;
          message: string;
          timestamp: number;
      
          constructor(id: string, protocolId: string, userId: string, actor: string, message: string, timestamp: number) {
              this.id = id;
              this.protocolId = protocolId;
              this.userId = userId;
              this.actor = actor;
              this.message = message;
              this.timestamp = timestamp;
          }
        }
      `
      );
      this.db.signer(async (data: string) => {
        return null;
      });
      PolybaseService.isInitialized = true;
    } catch (error) {}
  }

  static async createMessage(
    protocolId: string,
    userId: string,
    actor: string,
    message: string
  ): Promise<void> {
    await this.init();
    await this.db
      .collection("ConversationMessages")
      .create([nanoid(), protocolId, userId, actor, message, Date.now()]);
  }

  static async getMessages(
    protocolId: string,
    userId: string
  ): Promise<
    CollectionList<{
      id: string;
      actor: string;
      message: string;
      protocolId: string;
      timestamp: number;
    }>
  > {
    await this.init();
    return await this.db
      .collection("ConversationMessages")
      .where("userId", "==", userId)
      .get();
  }

  static async clearMessages(protocolId: string, userId: string) {
    await this.init();
    const messages = (await this.getMessages(protocolId, userId)).data;
    await Promise.all(
      messages.map((message) => {
        return this.db
          .collection("ConversationMessages")
          .record(message.data.id)
          .call("del");
      })
    );
  }
}
