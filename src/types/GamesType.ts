import { Collection } from "discord.js"
import { Poker } from "../Poker";

export type GamesType = {
    games: Collection<string, Poker>
}