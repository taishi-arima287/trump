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

  const dealer = document.getElementById("dealer-cards");
  const player = document.getElementById("player-cards");
  const playButton = document.getElementById("play-button");
  playButton?.addEventListener("click", () => {
    const shuffleCards = cardsShuffle(allCards);
    // 既存のカードをクリア
    if (dealer) dealer.innerHTML = "";
    if (player) player.innerHTML = "";

    // ディーラーのカードを表示（A→Kの順に並び替え）
    shuffleCards
      .slice(0, 5)
      .sort((a, b) => {
        // Aは最強なので左端（1を14として扱う）
        const valueA = a.value === 1 ? 14 : a.value;
        const valueB = b.value === 1 ? 14 : b.value;
        // 降順（大きい順）にソート
        return valueB - valueA;
      })
      .forEach((card) => {
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

        // 下部のグループ（反転表示用）
        const bottomGroup = document.createElement("div");
        bottomGroup.className = "card-group bottom";
        bottomGroup.appendChild(suitElement.cloneNode(true));
        bottomGroup.appendChild(valueElement.cloneNode(true));

        li.appendChild(topGroup);
        li.appendChild(bottomGroup);
        dealer?.appendChild(li);
      });

    // プレイヤーのカードを表示（A→Kの順に並び替え）
    shuffleCards
      .slice(5, 10)
      .sort((a, b) => {
        const valueA = a.value === 1 ? 14 : a.value;
        const valueB = b.value === 1 ? 14 : b.value;
        return valueB - valueA;
      })
      .forEach((card) => {
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

        // 下部のグループ（反転表示用）
        const bottomGroup = document.createElement("div");
        bottomGroup.className = "card-group bottom";
        bottomGroup.appendChild(suitElement.cloneNode(true));
        bottomGroup.appendChild(valueElement.cloneNode(true));

        li.appendChild(topGroup);
        li.appendChild(bottomGroup);
        player?.appendChild(li);
      });
  });
})();
