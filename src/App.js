import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [show, setShow] = useState(false);
  const [selectedFriend, setSeletedFriend] = useState(null);

  function handleShow() {
    setShow(!show);
  }

  function handleAddFriends(friend) {
    setFriends((friends)=> [...friends,friend]);
    setShow(false)
  }

   function handleSelection(friend){
   
    setSeletedFriend(seleted=>seleted?.id === friend.id ? null : friend)
    setShow(false)
  }

  function handleSplitBill(value){
       console.log(value)
       setFriends(friends=>friends.map(friend => friend.id=== selectedFriend.id ? {...friend, balance:friend.balance + value}: friend
        )
       );
       setSeletedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friend={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {show && <FormAddFriend onAddFriend={handleAddFriends} />}

        <Button onClick={handleShow}>{show ? "Close" : "Add friend"}</Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

export default App;

function FriendList({ friend, onSelection, selectedFriend }) {
  return (
    <ul>
      {friend.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {

  const isSelected = selectedFriend?.id===friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe
          {friend.name} {Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  );
}

function FormAddFriend({onAddFriend}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      name,
      image:`${image}?=${id}`,
      id: id,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label>👯‍♂️Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({selectedFriend, onSplitBill}) {
const [bill, setBill] = useState("")
const [paidByUser, setPaidByUser] = useState("");
const paidByFriend = bill ? bill - paidByUser : ""
const [whoIsPaying, setWhoIsPaying] = useState("");

function handleSubmit(e){
  e.preventDefault()
  if(!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
}


  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split a bill with {selectedFriend.name}</h2>

      <label>🤑Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your expence</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill
              ? paidByFriend
              : Number(e.target.value)
          )
        }
      />

      <label>👯‍♂️{selectedFriend.name}'s expence</label>
      <input type="text" disabled value={paidByFriend} />

      <label>Who is paying bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
