const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')
const Data  = require('./lib/Data')

let bot = new Bot()


// ROUTING
bot.onEvent = function(session, message) {
  if (session.get('choice') === undefined){
    session.set('choice',-1)
  }

  switch (message.type) {
    case 'Init':
      welcome(session)
      break
    case 'Message'://any combo of text buttons and image / video links
      onMessage(session, message)
      break
    case 'Command'://command sent silently as a result of button presses
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session, message)
      break
    case 'PaymentRequest':
      welcome(session)
      break
  }
}

function onMessage(session, message) {
 
  switch(session.get('choice')){
    case -1:
      welcome(session)
      break
    case 0:
      addProblem(session, message.body)
      session.set('choice',-1);
      break
    case 1:
      deleteProblem(session, message.body)
      session.set('choice',-1);
      break
    case 2:
      donate(session, message.body)
      session.set('choice',-1);
      break
    case 3:
      withdraw(session, message.body)
      session.set('choice',-1);
      break

  }
}

function onCommand(session, command) {
  switch (command.content.value) {
    case 'add' :
      addProblem(session,"")
      break
    case 'delete' :
      deleteProblem(session,0)
      break
    // case 'ping':
    //   pong(session)
    //   break
    // case 'count':
    //   count(session)
    //   break
    case 'donate':
      donate(session,"")
      break
    case 'viewproblems':
      welcome(session)
      break
    case 'history':
      history(session)
      break
    case 'withdraw':
      withdraw(session,"")
      break
    }
}

function onPayment(session, message) {
  if (message.fromAddress == session.config.paymentAddress) {
    // handle payments sent by the bot
    if (message.status == 'unconfirmed') {
      // payment has been sent to the ethereum network, but is not yet confirmed
      sendMessage(session, `Make sure you use it well! `);
    } 

    else if (message.status == 'confirmed') {
      // perform special action once the payment has been confirmed
      // on the network
    } else if (message.status == 'error') {
      // oops, something went wrong with a payment we tried to send!
      sendMessage(session, `There was an error with your payment!🚫`);
    
    }
  } else {
    // handle payments sent to the bot
    if (message.status == 'unconfirmed') {
      // payment has been sent to the ethereum network, but is not yet confirmed
      sendMessage(session, `Thanks for the payment! 🙏`);
    } else if (message.status == 'confirmed') {
      // handle when the payment is actually confirmed!
    } else if (message.status == 'error') {
      sendMessage(session, `There was an error with your payment!🚫`);
    }
  }
}

// STATES

function welcome(session) {
   // session.sendEth(0);
  tmp = Data.getNoOfProblems();
  tmpProblems = Data.getProblems();
  // tmpProblemsFund = Data.getProblemsFund();
  sendMessage(session, "Hello user! Currently we are facing "+tmp+" problem(s)");
  for( let i = 0;i<tmp;i++){
    console.log(tmpProblems[i]);
    sendMessage(session, (i+1)+" : "+tmpProblems[i].toString());
  }
    sendMessage(session, "Current Funding : "+Data.getFunds()+" $")

  
}
function addProblem(session,prb){
  session.set('choice',0);
  if(prb===""){
    sendMessage2(session, "What is the problem?")
  }
  else{
    Data.setNoOfProblems();
    Data.setProblems(prb);
    // Data.setProblemsFund();
    Data.setHistory("'"+prb+"' added by user : "+session.user.username)
    sendMessage(session, "The problem is registered")
  }
}
function withdraw(session,prb){
  session.set('choice',3);
  tmp = parseFloat(prb)
  if(prb===""){
    sendMessage2(session, "The balance is : " + Data.getFunds()+" $")
    sendMessage2(session, "How much do you want to withdraw ($)?")
  }
  else if(tmp > Data.getFunds()){
    sendMessage(session, "Insufficient funds! Sorry")
  }
  else
  {
    Fiat.fetch(0).then((toEth) => {

          let giftAmount = toEth.USD(tmp)
          // console.log(session)
          tmp2 = session.user.username
          // console.log(session.user.username)
          Data.setFunds(-1*tmp)
          Data.setHistory(tmp+" $ withdrawn by : "+ tmp2)
          session.sendEth(giftAmount,function(session,error,res){
            console.log(error)
          })
        })
  }
}
function deleteProblem(session,prb){
  session.set('choice',1);
  prb = parseInt(prb)-1
  if(prb===-1){
    sendMessage2(session, "Enter the problem to delete?")
  }
  else{
    if(prb>-1 && prb<Data.getNoOfProblems()){
      Data.decrementNoOfProblems();
      Data.setHistory("'"+Data.getProblems()[prb]+"' deleted by user : "+session.user.username)
      Data.deleteProblems(prb);
                
      sendMessage(session, "Problem deleted successfully")
    }else{
      sendMessage(session, "Enter a valid problem number")
    }
  }

}
function pong(session) {
  Data.setNoOfProblems();
  Data.setProblems("fire");
  // Data.setProblemsFund();
  sendMessage(session, `Pong`)
}
function history(session) {
  tmp = Data.getHistory();
  if(tmp.length==0){
    sendMessage(session,"---no activity yet---")
  }
  else{
    for( let i = 0;i<tmp.length;i++){
      // console.log(tmpProblems[i]);
      sendMessage(session,tmp[i]);
    }
  }
  // Data.setProblemsFund();
}

// example of how to store state on each user
function count(session) {
  // let count = (session.get('count') || 0) + 1
  // let count = countUniv + 1;
  Data.set();
  let count = Data.get();

  session.set('count', count)
  sendMessage(session, `${count}`)
}

function donate(session,money) {
  // request $1 USD at current exchange rates
  session.set('choice',2);
  if(money===""){
    sendMessage2(session, "How much would you donate ($)?")
  }
  else if(isNaN(money)){
    sendMessage(session, "Enter a valid amount")
  }
  else{
    money = parseFloat(money);
    Fiat.fetch().then((toEth) => {
      session.requestEth(toEth.USD(money))
      Data.setFunds(money)
      Data.setHistory(money+" $ donated by "+session.user.username)
      console.log(Data.getHistory());
    })
  }
}

// HELPERS

function sendMessage(session, message) {
  let controls = [
    {type: 'button', label: 'Add Problem', value: 'add'},
    {type: 'button', label: 'Delete Problem', value: 'delete'},
    {type: 'button', label: 'Donate', value: 'donate'},
    {type: 'button', label: 'Withdraw', value: 'withdraw'},
    {type: 'button', label: 'View Problems', value: 'viewproblems'},
    {type: 'button', label: 'History', value: 'history'},
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }))
}
function sendMessage2(session, message) {
  session.reply(SOFA.Message({
    body: message,
    showKeyboard: true,
  }))
}
