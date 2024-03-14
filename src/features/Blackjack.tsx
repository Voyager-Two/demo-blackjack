import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";

const Blackjack = () => {
  const [deckID, setDeckID] = useState("");
  const [houseCards, setHouseCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [housePoints, setHousePoints] = useState(0);
  const [winner, setWinner] = useState("");
  // Run through 52 cards and reshuffle instead of using a new deck
  const [remainingCards, setRemainingCards] = useState(0);

  const playAgain = () => {
    setWinner("");
    dealNewCards();
  }

  const dealNewCards = async () => {
    if (remainingCards < 4) {
      // Brand new deck
      let API_URL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
      if (deckID) {
        // Reshuffle the existing deck
        API_URL = `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`;
        setRemainingCards(52);
      }
      await axios
        .get(API_URL)
        .then((response) => {
          if (!response?.data?.deck_id) {
            console.error("result", response);
            return;
          }
          const data = response.data;
          console.log("result", data);
          setDeckID(data.deck_id);
          draw("house", data.deck_id);
          draw("player", data.deck_id);
        })
        .finally(() => {
          // setLoading(false);
        });
    } else {
      // Draw cards from the existing deck
      await draw("house", deckID);
      await draw("player", deckID);
    }
  };

  const draw = async (forWhom: string, deckID: string) => {
    // setLoading(true);
    // Dealer draws 2 cards
    await axios
      .get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`)
      .then((response) => {
        if (!response?.data?.cards) {
          console.error("result", response);
          return;
        }
        const data = response.data;
        console.log("result", data);
        if (forWhom === "house") {
          setHouseCards(data.cards);
          const points = calculatePoints(data.cards);
          setHousePoints(points);
          setRemainingCards(data.remaining);
          if (points === 21) {
            console.log("House wins!");
            setWinner("House (on initial draw)!");
          }
        } else {
          setPlayerCards(data.cards);
          const points = calculatePoints(data.cards);
          setPlayerPoints(points);
          setRemainingCards(data.remaining);
          if (points === 21) {
            console.log("Player wins!");
            setWinner("Player (on initial draw)!");
          } else if (points > 21) {
            console.log("Player busts!");
            setWinner("House wins (player busts)!");
          }
        }
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  const hit = async () => {
    // Player draws a card
    if (remainingCards === 0) {
      // Reshuffle the deck before drawing
      const API_URL = `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`;
      await axios
        .get(API_URL)
        .then((response) => {
          if (!response?.data?.deck_id) {
            console.error("result", response);
            return;
          }
          const data = response.data;
          setRemainingCards(52);
          console.log("result", data);
        })
        .finally(() => {
          // setLoading(false);
        });
    }
    await axios
      .get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
      .then((response) => {
        if (!response?.data?.cards) {
          console.error("result", response);
          return;
        }
        const data = response.data;
        console.log("result", data);
        // Add the card to the player's hand
        // @ts-ignore
        const newPlayerCards = [...playerCards, data.cards[0]];
        // @ts-ignore
        setPlayerCards(newPlayerCards);
        const points = calculatePoints(newPlayerCards);
        setPlayerPoints(points);
        setRemainingCards(data.remaining);
        if (points === 21) {
          console.log("Player wins!");
          setWinner("Player!");
        } else if (points > 21) {
          console.log("Player busts!");
          setWinner("House (player busts)!");
        }
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  const stand = async () => {
    // End the game and set the winner
    if (housePoints > playerPoints) {
      console.log("House wins!");
      setWinner("House!");
    } else if (housePoints === playerPoints) {
      console.log("It's a tie!");
      setWinner("It's a tie!");
    } else {
      console.log("Player wins!");
      setWinner("Player!");
    }
  }

  const calculatePoints = (cards: any) => {
    return cards.reduce((acc: number, card: any) => {

      if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK") {
        return acc + 10;
      }

      if (card.value === "ACE") {
        // It should be 1 or 11 depending on the total points, whichever is better for player
        if (acc + 11 > 21) {
          return acc + 1;
        } else {
          return acc + 11;
        }
      }

      // All other cards
      return acc + parseInt(card.value);
    }, 0);
  };

  return (
    <>
      <div>Deck ID: {deckID}</div>
      <div>Remaining cards: {remainingCards}</div>
      <br />
      <h1 className="text-xl">House ({housePoints} points):</h1>
      <div className="flex justify-center space-x-3">
        {houseCards &&
          houseCards.map((card: any) => <img key={card.code} src={card.image} alt={card.code} />)}
      </div>
      <br />
      <h1 className="text-xl">You ({playerPoints} points):</h1>
      <div className="flex flex-wrap justify-center space-x-3 space-y-3">
        {playerCards &&
          playerCards.map((card: any) => <img key={card.code} src={card.image} alt={card.code} />)}
      </div>

      <br />
      {winner !== "" && <div className="text-3xl text-center my-10">Winner: {winner}</div>}

      <div className="flex align-center justify-center space-x-2">
        {winner === "" && (
          <>
            <Button color="warning" variant="solid" type="submit" onClick={dealNewCards} size="lg">
              Deal new cards
            </Button>

            <br />
            <br />

            <Button color="primary" variant="solid" type="submit" onClick={hit} size="lg">
              Hit
            </Button>

            <Button color="primary" variant="solid" type="submit" onClick={stand} size="lg">
              Stand
            </Button>
          </>
        )}
        {winner !== "" && (
          <Button color="warning" variant="solid" type="submit" onClick={playAgain} size="lg">
            Play again
          </Button>
        )}
      </div>
    </>
  );
};

export default Blackjack;
