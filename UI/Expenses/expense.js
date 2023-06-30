const form = document.getElementById("form");
const amount = document.getElementById("exp_amount");
const description = document.getElementById("exp_desc");
const category = document.getElementById("category");
const date = document.getElementById("date");
const update = document.querySelector(".edit-wrap");
const user = document.querySelector(".expense-data tbody");
const premium = document.getElementById("premium");
const premium_user = document.getElementById("premiumuser");
const leader = document.getElementById("leaderboard");

async function getdata() {
  const token = localStorage.getItem("userId");

  async function premium_check() {
    const check = await axios.get("http://localhost:5000/premiumcheck", {
      headers: { Authorization: token },
    });
    if (check.data.data == true) {
      premium_user.style.display = "inline";
    } else {
      if (check.data.data != true) {
        premium.style.display = "inline";
      }
    }
  }
  premium_check();

  const getitems = await axios.get("http://localhost:5000/expense", {
    headers: { Authorization: token },
  });
  const response = getitems.data;
  const data = response.data;
  console.log(response);
  for (let i = 0; i < data.length; i++) {
    onscreen(data[i]);
  }
}
getdata();

function onscreen(get) {
  const exp_id = get.id;
  const exp_date = get.date;
  const exp_amt = get.expense_amount;
  const exp_desc = get.description;
  const exp_cat = get.category;

  const tr = document.createElement("tr");
  const td_date = document.createElement("td");
  const td_amt = document.createElement("td");
  const td_name = document.createElement("td");
  const td_cat = document.createElement("td");
  const td_action = document.createElement("td");

  td_date.innerText = exp_date;
  td_name.innerText = exp_desc;
  td_cat.innerText = exp_cat;
  td_amt.innerText = exp_amt;

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = `<span class="Deletebtn">Delete</span>`;
  td_action.appendChild(deleteBtn);

  // const editbtn = document.createElement("button");
  // editbtn.innerHTML = `<span class= "editbtn">Edit</span>`;
  // td_action.appendChild(editbtn);

  tr.appendChild(td_date);
  tr.appendChild(td_amt);
  tr.appendChild(td_name);
  tr.appendChild(td_cat);
  tr.appendChild(td_action);

  user.appendChild(tr);

  deleteBtn.addEventListener("click", async () => {
    deleteBtn.parentNode.parentNode.remove();
    await axios.delete(`http://localhost:5000/expense/${exp_id}`);
  });

  // editbtn.addEventListener("click", async () => {
  //   document.querySelector(".edit-wrap").style.display = "block";
  //   document.querySelector("button").style.display = "none";

  //   document.getElementById("date").value = exp_date;
  //   document.getElementById("exp_amount").value = exp_amt;
  //   document.getElementById("exp_desc").value = exp_desc;
  //   document.getElementById("category").value = exp_cat;

  //   const update = document.querySelector(".edit-wrap");

  //   update.addEventListener("click", async () => {
  //     const updatedDate = document.getElementById("date").value;
  //     const updatedAmount = document.getElementById("exp_amount").value;
  //     const updatedDescription = document.getElementById("exp_desc").value;
  //     const updatedCategory = document.getElementById("category").value;

  //     document.querySelector(".edit-wrap").style.display = "none";
  //     document.querySelector("button").style.display = "inline";

  //     let date_temp = updatedDate.split("-");
  //     let date_update = `${date_temp[2]}/${date_temp[1]}/${date_temp[0]}`;

  //     const obj = {
  //       date: date_update,
  //       expense_amount: updatedAmount,
  //       description: updatedDescription,
  //       category: updatedCategory,
  //     };

  //     await axios.patch(`http://localhost:5000/expense/${exp_id}`, obj);
  //     user.innerHTML = "";
  //     await getdata();

  //     document.getElementById("date").value = "";
  //     document.getElementById("exp_amount").value = "";
  //     document.getElementById("exp_desc").value = "";
  //     document.querySelector("button").style.display = "inline";
  //   });
  // });
}

form.addEventListener("submit", onsubmit);

function onsubmit(e) {
  e.preventDefault();

  let format = date.value.split("-");
  let newdate = `${format[2]}/${format[1]}/${format[0]}`;

  const obj = {
    date: newdate,
    expense_amount: amount.value,
    description: description.value,
    category: category.value,
    userId: localStorage.getItem("userId"),
  };

  async function postdata() {
    user.innerHTML = "";
    const post = await axios.post("http://localhost:5000/expense", obj);

    await getdata();

    const token = localStorage.getItem("userId");
    const config = { headers: { Authorization: token } };

    const total_expense = await axios.patch(
      "http://localhost:5000/total_expense",
      obj,
      config
    );
  }

  postdata();

  date.value = "";
  description.value = "";
  amount.value = "";
}

premium.addEventListener("click", submit);

async function submit(e) {
  e.preventDefault();

  const token = localStorage.getItem("userId");
  const response = await axios.get("http://localhost:5000/premium", {
    headers: { Authorization: token },
  });

  var options = {
    key: response.data.key_id,
    order_id: response.data.orders.id,
    handler: async function (response) {
      await axios.post(
        "http://localhost:5000/Statusupdate",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
          status: "Success",
        },
        { headers: { Authorization: token } }
      );
      alert("You are a premium user");
    },
  };

  var rzp = new Razorpay(options);

  rzp.open();

  rzp.on("payment.failed", function (response) {
    console.log(response);
    const paymentId = response.error.metadata.payment_id;
    axios.post(
      "http://localhost:5000/Statusupdate",
      {
        order_id: options.order_id,
        payment_id: paymentId,
        status: "Failure",
      },
      { headers: { Authorization: token } }
    );
    alert("Something went wrong");
  });
}

leader.addEventListener("click", async () => {
  const token = localStorage.getItem("userId");
  const check = await axios.get("http://localhost:5000/premiumcheck", {
    headers: { Authorization: token },
  });
  if (check.data.data == true) {
    window.location.href = "/UI/Premium/premium.html";
  } else {
    alert("Purchase Premium!! To enjoy Leaderboard like other feautures");
  }
});
