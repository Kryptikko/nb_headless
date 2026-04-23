import type { ChatLine } from "../../types/Chat";
import container from "./container";

const chat = (log: Array<ChatLine>, header: string = "", width: number = 0): string => {
  return container(
    log.map(line => `[${line[0]}]: ${line[1]}`)
      .join('\n'),
    header,
    width
  )
}
export default chat
