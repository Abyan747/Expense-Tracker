import { useEffect, useState } from "react";
import "./styles.css"; 
import { PieChart, Pie,Tooltip, ResponsiveContainer } from 'recharts';

let data2=[{name:"food",value:0},{name:"utility",value:0},{name:"entertainment",value:0},{name:"salary",value:0}]
export default function App(){
  const [amt,setAmt] = useState(1)
  const [date,setDate] = useState("2024-07-2")
  const [cat,setCat] = useState("food")
  const [desc,setDesc] = useState()
  const [expenses,setExpenses] = useState(() => {
    const localValue = localStorage.getItem("ITEMS")
    if (localValue == null) return []
    return JSON.parse(localValue)
  }) 
  const [search,setSearch]=useState("")
  const [value,setValue]=useState("category")
  const [type,setType]=useState("expense")
  const [valueType,setValueType]=useState("type")
  const [data,setData]=useState([])
  
  useEffect(()=>{
    localStorage.setItem("ITEMS", JSON.stringify(expenses))
  },[expenses])


  function handleSubmit(e){
    e.preventDefault()

    setExpenses((currEx) => {
      return [...currEx, {id: crypto.randomUUID(), amt:amt, date:date, cat:cat, desc:desc, type:type}]
    })
      for (let i of data2){
        if (i.name==cat){
          i.value += Number(amt)
        }
      }
      console.log(data2)
    setData([ {name:"food",value:data2[0].value}, {name:"utility", value:data2[1].value}, {name:"entertainment", value:data2[2].value}, {name:"salary", value:data2[3].value}])
    setAmt(1)
    setCat("food")
    setDate("2024-07-2")
    setDesc("")
  }

  const options = [
    {label:"food", value:"food"},
    {label:"utility", value:"utility"},
    {label:"entertainment", value:"entertainment"},
    {label:"salary", value:"salary"},
  ]
  
  const types = [
    {label:"expense", value:"expense"},
    {label:"income", value:"income"},
  ]

  function deleteExpense(id,cat2,amt2) {
    setExpenses(currEx => currEx.filter(expense => expense.id !== id))
    for (let i of data2){
      if (i.name==cat2){
        i.value -= Number(amt2)
      }
    }
    console.log(data2)
  setData([ {name:"food",value:data2[0].value}, {name:"utility", value:data2[1].value}, {name:"entertainment", value:data2[2].value}, {name:"salary", value:data2[3].value}])
  }

  function handleSelect(event){
    setCat(event.target.value)
  }

  function handleSelectType(event){
    setType(event.target.value)
  }

  function handleSelect2(event){
    setValue(event.target.value)
  }
  function handleSelect3(event){
    setValueType(event.target.value)
  }


  return (
    
    <>
    
    <h1 className="header">DASHBOARD</h1>
    <div className="PieChart">
    <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
    </ResponsiveContainer>
    </div>
    <h1 className="header">ADD TRANSACTION</h1>
    <form className="form" onSubmit={handleSubmit}>
      <div>
      <label htmlFor="amount">Amount:</label>
      <input type="number" value={amt} onChange={e => setAmt(e.target.value)} 
      id="amount" min="1" required />
      </div>
      <div>
        <label htmlFor="date">DATE:</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
        id="date" min="2024-07-2" required />
      </div>
      <div>
        <label htmlFor="category">CATEGORY:</label>
        <select id="category" onChange={handleSelect}>
          {options.map(option => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
           
      </div>
      <div>
        <label htmlFor="desc">DESCRIPTION:</label>
        <input type="text" value = {desc} onChange={e => setDesc(e.target.value)}
        id="desc" required />
      </div>
      <div>
        <label htmlFor="type">TYPE:</label>
        <select id="type" onChange={handleSelectType}>
          {types.map(ty => (
            <option value={ty.value}>{ty.label}</option>
          ))}
        </select>
      </div>
      <div>
        <button className="btn">ADD</button>
      </div>
    </form>



    <h1 className="header">TRANSACTIONS</h1>

      <input className="search" type="text"  onChange={(e) => setSearch(e.target.value)}
      placeholder="Search Transactions by description" />
      <div className="filter">
        <select id="category2" onChange={handleSelect2}>
            <option value='category'>Category</option>
            {options.map(option => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
        <select id="type2" onChange={handleSelect3}>
            <option value='type'>Type</option>
            {types.map(ty => (
              <option value={ty.value}>{ty.label}</option>
            ))}
          </select>

      </div> 
    <ul className="list">
      {expenses.length===0 && "No Transactions"}
      {expenses
      .filter((exp) => {
        return search.toLowerCase() === '' ? exp : exp.desc.toLowerCase().includes(search)
      })
      .filter((exp) => {
        return value === 'category' ? exp : exp.cat === value
      })
      .filter((exp) => {
        return valueType === 'type' ? exp : exp.type === valueType
      })
      .map(expense => {
        return <li key={expense.id}>
          <p>Date:  {expense.date}</p>
          <div>
            <p>Description:   {expense.desc}</p> 
          </div>
          <h3>Amount: {expense.amt}</h3>
          <p className="category">Category:   {expense.cat}</p>
          <p>Type: {expense.type}   </p>
          <div className="buttons">
            <button onClick={() => updateExpense(expense.id)}  className="btn-edit">EDIT</button>
            <button onClick={() => deleteExpense(expense.id,expense.cat,expense.amt)}
              className="btn-delete">DELETE</button>
          </div>
        </li>
      })}
    </ul>
    </>
  )

}