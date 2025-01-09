(() => {
  type Card = {
    value: number;
    suit: string;
  };

  /**
   * 指定されたスートの13枚のカードを生成する
   * @param suit カードのスート（"spade" | "heart" | "diamond" | "club"）
   * @returns 生成されたカード配列（1-13の数値を持つ同一スートのカード）
   */
  const createCards = (suit: string): Card[] =>
    [...Array(13)].map((_, i) => ({
      value: i + 1,
      suit,
    }));

  const allCards: Card[] = [
    ...createCards("spade"),
    ...createCards("heart"),
    ...createCards("diamond"),
    ...createCards("club"),
  ];

  /**
   * カードの配列をシャッフルする
   * @param array シャッフルする対象のカード配列
   * @returns シャッフルされたカード配列
   */
  const cardsShuffle = (array: Card[]): Card[] => {
    // 配列の最後から順に処理
    for (let i = array.length - 1; 0 < i; i--) {
      // 0からi番目までのランダムな位置を取得
      let r = Math.floor(Math.random() * (i + 1));

      // 現在の位置(i)とランダムな位置(r)の要素を交換
      let tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    return array;
  };

  /**
   * カードの数値とスートからHTML要素を生成する
   * @param value カードの数値（1-13）
   * @param suit カードのスート（"spade" | "heart" | "diamond" | "club"）
   * @returns [数値のspan要素, スートのspan要素]
   */
  const createSuitNumber = (
    value: number,
    suit: string
  ): [HTMLSpanElement, HTMLSpanElement] => {
    // 数値要素の生成
    const valueElement = document.createElement("span");
    valueElement.textContent = createValue(value);

    // スート要素の生成
    const suitElement = document.createElement("span");

    // スートに応じた文字と色を設定
    switch (suit) {
      case "spade":
        suitElement.textContent = "♠";
        suitElement.style.color = "black";
        valueElement.style.color = "black";
        break;
      case "heart":
        suitElement.textContent = "♥";
        suitElement.style.color = "red";
        valueElement.style.color = "red";
        break;
      case "diamond":
        suitElement.textContent = "♦";
        suitElement.style.color = "red";
        valueElement.style.color = "red";
        break;
      case "club":
        suitElement.textContent = "♣";
        suitElement.style.color = "black";
        valueElement.style.color = "black";
        break;
      default:
        "";
    }
    return [valueElement, suitElement];
  };

  /**
   * カードの数値を表示用の文字列に変換する
   * @param value 変換する数値（1-13）
   * @returns 変換後の文字列
   * - 1 → 'A'（エース）
   * - 11 → 'J'（ジャック）
   * - 12 → 'Q'（クイーン）
   * - 13 → 'K'（キング）
   * - その他 → 数値をそのまま文字列化
   */
  const createValue = (value: number): string => {
    switch (value) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return value.toString();
    }
  };

  /** ポーカーの役を表す型 */
  type PokerHand = {
    name: string; // 役の名前
    strength: number; // 役の強さ（数値が大きいほど強い）
    cards: Card[]; // 役を構成するカード
  };

  /**
   * 5枚のカードからポーカーの役を判定する
   * @param cards 判定する5枚のカード
   * @returns 判定された役の情報
   */
  const getPokerHand = (cards: Card[]): PokerHand => {
    // カードを数値順にソート（Aは14として扱う）
    const sortedCards = [...cards].sort((a, b) => {
      const valueA = a.value === 1 ? 14 : a.value;
      const valueB = b.value === 1 ? 14 : b.value;
      return valueB - valueA;
    });

    // 役の判定と返却値をまとめて処理
    switch (true) {
      case isRoyalFlush(sortedCards):
        return {
          name: "ロイヤルストレートフラッシュ",
          strength: 9,
          cards: sortedCards,
        };
      case isStraightFlush(sortedCards):
        return {
          name: "ストレートフラッシュ",
          strength: 8,
          cards: sortedCards,
        };
      case isFourOfAKind(sortedCards):
        return {
          name: "フォーカード",
          strength: 7,
          cards: sortedCards,
        };
      case isFullHouse(sortedCards):
        return {
          name: "フルハウス",
          strength: 6,
          cards: sortedCards,
        };
      case isFlush(sortedCards):
        return {
          name: "フラッシュ",
          strength: 5,
          cards: sortedCards,
        };
      case isStraight(sortedCards):
        return {
          name: "ストレート",
          strength: 4,
          cards: sortedCards,
        };
      case isThreeOfAKind(sortedCards):
        return {
          name: "スリーカード",
          strength: 3,
          cards: sortedCards,
        };
      case isTwoPair(sortedCards):
        return {
          name: "ツーペア",
          strength: 2,
          cards: sortedCards,
        };
      case isOnePair(sortedCards):
        return {
          name: "ワンペア",
          strength: 1,
          cards: sortedCards,
        };
      default:
        return {
          name: "ハイカード",
          strength: 0,
          cards: sortedCards,
        };
    }
  };

  const dealer = document.getElementById("dealer-cards");
  const player = document.getElementById("player-cards");
  const playButton = document.getElementById("play-button");
  playButton?.addEventListener("click", () => {
    const shuffleCards = cardsShuffle(allCards);

    // 既存のカードをクリア
    if (dealer) dealer.innerHTML = "";
    if (player) player.innerHTML = "";

    // ディーラーとプレイヤーのカードを取得
    const dealerCards = shuffleCards.slice(0, 5);
    const playerCards = shuffleCards.slice(5, 10);

    // 役を判定
    const dealerHand = getPokerHand(dealerCards);
    const playerHand = getPokerHand(playerCards);

    // ディーラーのカードを表示（強さ順にソート）
    dealerHand.cards.forEach((card) => {
      const li = document.createElement("li");
      li.className = "card";
      const [valueElement, suitElement] = createSuitNumber(
        card.value,
        card.suit
      );

      // 上部のグループ
      const topGroup = document.createElement("div");
      topGroup.className = "card-group";
      topGroup.appendChild(valueElement.cloneNode(true));
      topGroup.appendChild(suitElement.cloneNode(true));

      // 下部のグループ
      const bottomGroup = document.createElement("div");
      bottomGroup.className = "card-group bottom";
      bottomGroup.appendChild(suitElement.cloneNode(true));
      bottomGroup.appendChild(valueElement.cloneNode(true));

      li.appendChild(topGroup);
      li.appendChild(bottomGroup);
      dealer?.appendChild(li);
    });

    // プレイヤーのカードを表示（強さ順にソート）
    playerHand.cards.forEach((card) => {
      const li = document.createElement("li");
      li.className = "card";
      const [valueElement, suitElement] = createSuitNumber(
        card.value,
        card.suit
      );

      // 上部のグループ
      const topGroup = document.createElement("div");
      topGroup.className = "card-group";
      topGroup.appendChild(valueElement.cloneNode(true));
      topGroup.appendChild(suitElement.cloneNode(true));

      // 下部のグループ
      const bottomGroup = document.createElement("div");
      bottomGroup.className = "card-group bottom";
      bottomGroup.appendChild(suitElement.cloneNode(true));
      bottomGroup.appendChild(valueElement.cloneNode(true));

      li.appendChild(topGroup);
      li.appendChild(bottomGroup);
      player?.appendChild(li);
    });

    // 勝敗判定と結果表示
    let result = "";
    if (dealerHand.strength > playerHand.strength) {
      result = `ディーラーの勝ち（${dealerHand.name} vs ${playerHand.name}）`;
    } else if (dealerHand.strength < playerHand.strength) {
      result = `プレイヤーの勝ち（${playerHand.name} vs ${dealerHand.name}）`;
    } else {
      result = `引き分け（${playerHand.name}）`;
    }

    const resultElement = document.getElementById("result");
    if (resultElement) {
      resultElement.textContent = result;
    }
  });

  /**
   * ロイヤルストレートフラッシュかどうかを判定
   */
  const isRoyalFlush = (cards: Card[]): boolean => {
    return (
      isFlush(cards) &&
      cards.map((c) => (c.value === 1 ? 14 : c.value)).join(",") ===
        "14,13,12,11,10"
    );
  };

  /**
   * ストレートフラッシュかどうかを判定
   */
  const isStraightFlush = (cards: Card[]): boolean => {
    return isFlush(cards) && isStraight(cards);
  };

  /**
   * フォーカードかどうかを判定
   */
  const isFourOfAKind = (cards: Card[]): boolean => {
    const values = cards.map((c) => c.value);
    return (
      new Set(values).size === 2 &&
      values.some((v) => values.filter((x) => x === v).length === 4)
    );
  };

  /**
   * フルハウスかどうかを判定
   */
  const isFullHouse = (cards: Card[]): boolean => {
    const values = cards.map((c) => c.value);
    return (
      new Set(values).size === 2 &&
      values.some((v) => values.filter((x) => x === v).length === 3)
    );
  };

  /**
   * ストレートかどうかを判定
   */
  const isStraight = (cards: Card[]): boolean => {
    const values = cards
      .map((c) => (c.value === 1 ? 14 : c.value))
      .sort((a, b) => a - b);
    // A,2,3,4,5のストレート判定
    if (values.join(",") === "2,3,4,5,14") return true;
    // 通常のストレート判定
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i + 1] - values[i] !== 1) return false;
    }
    return true;
  };

  /**
   * スリーカードかどうかを判定
   */
  const isThreeOfAKind = (cards: Card[]): boolean => {
    const values = cards.map((c) => c.value);
    return (
      new Set(values).size === 3 &&
      values.some((v) => values.filter((x) => x === v).length === 3)
    );
  };

  /**
   * ツーペアかどうかを判定
   */
  const isTwoPair = (cards: Card[]): boolean => {
    const values = cards.map((c) => c.value);
    const valueCounts = new Set(
      values.map((v) => values.filter((x) => x === v).length)
    );
    return new Set(values).size === 3 && valueCounts.has(2);
  };

  /**
   * ワンペアかどうかを判定（既存の関数を修正）
   */
  const isOnePair = (cards: Card[]): boolean => {
    const values = cards.map((c) => c.value);
    return new Set(values).size === 4;
  };

  /**
   * フラッシュかどうかを判定（既存の関数を修正）
   */
  const isFlush = (cards: Card[]): boolean => {
    return cards.every((card) => card.suit === cards[0].suit);
  };
})();
