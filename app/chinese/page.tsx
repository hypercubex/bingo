import BingoBoard from "@/components/BingoBoard";
import bilingualSet from "@/data/chinese.json";
import { BingoSymbolSet } from "@/types/bingo";

export default function ChinesePage() {
  return <BingoBoard activeSet={bilingualSet as BingoSymbolSet} />;
}