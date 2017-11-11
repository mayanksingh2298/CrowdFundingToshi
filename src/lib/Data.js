var noOfProblems = 0;
var problems = [];
var funds = 0;
var history = [];
// var problemsFund = [];
module.exports={
	getNoOfProblems:function(){
		return noOfProblems;
	},
	setNoOfProblems:function(){
		noOfProblems+=1;
	},
	decrementNoOfProblems:function(){
		noOfProblems-=1;
	},

	getProblems:function(){
		return problems;
	},
	setProblems:function(prb){
		problems.push(String(prb));
	},
	deleteProblems:function(i){
		problems.splice(i,i+1)
	},

	getFunds:function(){
		return funds;
	},
	setFunds:function(f){
		funds += f;
	},

	getHistory:function(){
		return history;
	},
	setHistory:function(f){
		history.push(f);
	}

	// getProblemsFund:function(){
	// 	return problemsFund;
	// },
	// setProblemsFund:function(){
	// 	problemsFund.push(0);
	// },
	// deleteProblemsFund:function(i){
	// 	problemsFund.splice(i,i+1)
	// }

};