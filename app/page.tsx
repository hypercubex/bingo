import BingoBoard from "@/components/BingoBoard";
import wordsSet from "@/data/words.json";
import { BingoSymbolSet } from "@/types/bingo";

export default function WordsPage() {
  return <BingoBoard activeSet={wordsSet as BingoSymbolSet} />;
}