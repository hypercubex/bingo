import BingoBoard from "@/components/BingoBoard";
import mahjongSet from "@/data/mahjong.json";
import { BingoSymbolSet } from "@/types/bingo";

export default function MahjongPage() {
  return <BingoBoard activeSet={mahjongSet as BingoSymbolSet} />;
}