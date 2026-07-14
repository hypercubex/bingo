import BingoBoard from "@/components/BingoBoard";
import worldCupSet from "@/data/flags.json";
import { BingoSymbolSet } from "@/types/bingo";

export default function FlagsPage() {
  return <BingoBoard activeSet={worldCupSet as BingoSymbolSet} />;
}