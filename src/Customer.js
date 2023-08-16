import React, { Component } from 'react';
import { variabales } from './Variables';

export class Customer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Customers: [],
      CustomerName: "",
      CustomerAddress: "",
      Quantity: 0,
      TotalPrice:0,
      StoreLocation: "",
      ItemNames: [], // State variable to hold item names
      MRPPrices: [], // State variable to hold MRP prices
      rows: [],
    };
    
  }

  refreshList() {
   
    fetch(variabales.API_URL + 'Customer')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const itemNames = data.map((item) => item.itemName);
        const mrpPrices = data.map((item) => item.mrpPrice);

        this.setState({ ItemNames: itemNames, MRPPrices: mrpPrices, dataLoaded: true });
      })
      .catch((error) => {
        console.error('Error fetching ItemNames and MRPPrices:', error);
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  
  handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10); 
    const { SMRPPrice } = this.state; 

    const newTotalPrice = SMRPPrice * newQuantity;

   
    this.setState({
      Quantity: newQuantity,
      TotalPrice: newTotalPrice,
    });
  };

  handleAddRow = () => {
    const newRow = {
      ItemName: '',
      MRPPrice: '',
      Quantity: '',
      TotalPrice: '',
    };
    this.setState((prevState) => ({
      rows: [...prevState.rows, newRow],
    }));
  };

  handleItemNameChange = (event) => {
    const itemName = event.target.value;
    const { dataLoaded, ItemNames, MRPPrices } = this.state;
  
    if (dataLoaded) {
      const index = ItemNames.indexOf(itemName);
      if (index !== -1) {
        const selectedMRP = MRPPrices[index];
        this.setState({
          SItemName: itemName,
          SMRPPrice: selectedMRP,
        });
      }
    }
  };
  
  handleDynamicQuantityInputChange = (e, index) => {
    const { name, value } = e.target;
    this.setState((prevState) => {
      if (name === 'ItemName' || name === 'MRPPrice' || name === 'Quantity') {
        
        const updatedRows = [...prevState.rows];
        updatedRows[index] = { ...updatedRows[index], [name]: value };
  
    
        const mrp = parseFloat(updatedRows[index].MRPPrice);
        const quantity = parseFloat(updatedRows[index].Quantity);
        updatedRows[index].TotalPrice = isNaN(mrp) || isNaN(quantity) ? '' : (mrp * quantity).toFixed(2);
  
        return { rows: updatedRows };
      } else {
       
        return { [name]: value };
      }
    });
  };
  

  handleDynamicItemNameChange = (event, index) => {
    const { value } = event.target;
    const { dataLoaded, ItemNames, MRPPrices } = this.state;
  
    if (dataLoaded) {
      const selectedMRP = MRPPrices[ItemNames.indexOf(value)] || "";
      const rows = [...this.state.rows];
      rows[index] = { ...rows[index], ItemName: value, MRPPrice: selectedMRP };
  
      this.setState({ rows });
    }
  };

  handleRemoveRow = (index) => {
    this.setState((prevState) => ({
      rows: prevState.rows.filter((_, i) => i !== index),
    }));
  };

  handleCustomerNameChange = (event) => {
   
    const newName = event.target.value;

   
    this.setState({
      CustomerName: newName,
      
    });
  };

  handleCustomerAddressChange = (event) => {
  
    const newName = event.target.value;

    
    this.setState({
      CustomerAddress: newName,
      
    });
  };

   sendDataToAPI = () => {
    const staticData = {
      CustomerName:this.state.CustomerName,
      CustomerAddress:this.state.CustomerAddress,
      ItemName: this.state.SItemName,
      MRPPrice: this.state.SMRPPrice,
      Quantity: this.state.Quantity,
      TotalPrice: this.state.TotalPrice,
      StoreLocation: " ", 
    };
  
    const dynamicData = this.state.rows.map((row) => ({
      ItemName: row.ItemName,
      MRPPrice: row.MRPPrice,
      Quantity: row.Quantity,
      TotalPrice: row.TotalPrice,
      StoreLocation: " ", 
    }));
  
    const itemData = {
    ItemsDate: [
      ...dynamicData,
      {
        ItemName: this.state.SItemName,
        MRPPrice: this.state.SMRPPrice,
        Quantity: this.state.Quantity,
        TotalPrice: this.state.TotalPrice,
      },
    ],
    ...staticData,
  };
  
    fetch(variabales.API_URL + 'Customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the API if needed
      console.log(data);
      this.setState({
        rows: [], 
        SItemName: '', 
        SMRPPrice: '',
        Quantity: '', 
        TotalPrice: '',  
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the API call
      console.error('Error:', error);
    });
  };
  

  
  render() {
   
    const { Customers, CustomerName, CustomerAddress, ItemName, SItemName, MRPPrice, Quantity, StoreLocation, ItemNames, SMRPPrice,TotalPrice, rows} = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', padding: '20px', height: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ flex: 1, marginRight: '20px' }}>This is my Customer page</h3>
        <button style={{ padding: '14px 36px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={this.sendDataToAPI}>Save</button>
      </div>
   <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
              <div>
                  <label htmlFor="CustomerName">CustomerName:</label>
                  <input type="text" name="CustomerName" value={CustomerName} onChange={this.handleCustomerNameChange} />
                </div>

                <div>
                  <label htmlFor="CustomerAddress">CustomerAddress:</label>
                  <input type="text" name="CustomerAddress" value={CustomerAddress} onChange={this.handleCustomerAddressChange} />
                </div>
          

         <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '20px' }}>
            <label htmlFor="ItemName">Item Name:</label>
            <select name="ItemName" value={SItemName} onChange={this.handleItemNameChange}>
              <option value="">Select an Item</option>
              {ItemNames.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginRight: '20px' }}>
        <label htmlFor="MRPPrice">MRP Price:</label>
        <input type="text" name="MRPPrice" value={SMRPPrice} readOnly />
      </div>

      <div style={{ marginRight: '20px' }}>
            <label htmlFor="Quantity">Quantity:</label>
            <input type="number" name="Quantity" value={Quantity}  onChange={this.handleQuantityChange}/>
          </div>

          <div style={{ marginRight: '20px' }}>
            <label htmlFor="TotalPrice">Total Price:</label>
            <input type="number" name="TotalPrice" value={TotalPrice} readOnly />
          </div>

        {/* "Add" button */}<div style={{ marginRight: '20px' }}>
        <button style={{ backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={this.handleAddRow}>Add</button>
        </div>
        </div>
        {/* Dynamically generated rows */}
        
        {rows.map((row, index) => (
         <div key={index} style={{ marginRight: '20px' }}>
         <label htmlFor={`ItemName_${index}`}>Item Name:</label>
         <select
           name="ItemName"
           id={`ItemName_${index}`}
           value={row.ItemName}
           onChange={(e) => this.handleDynamicItemNameChange(e, index)}
         >
           <option value="">Select an Item</option>
           {ItemNames.map((item, i) => (
             <option key={i} value={item}>
               {item}
             </option>
           ))}
         </select>

         <label htmlFor={`MRPPrice_${index}`}>MRP Price:</label>
         <input
           type="text"
           name="MRPPrice"
           id={`MRPPrice_${index}`}
           value={row.MRPPrice}
           readOnly
         />

            <label htmlFor={`Quantity_${index}`}>Quantity:</label>
            <input
              type="text"
              name="Quantity"
              id={`Quantity_${index}`}
              value={row.Quantity}
              onChange={(e) => this.handleDynamicQuantityInputChange(e, index)}
            />

            <label htmlFor={`TotalPrice_${index}`}>Total Price:</label>
            <input
              type="text"
              name="TotalPrice"
              id={`TotalPrice_${index}`}
              value={row.TotalPrice}
              readOnly
            />
                 {/* "Remove" button */}
            <button style={{ backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => this.handleRemoveRow(index)}>Remove</button>

          </div>
        ))}
     
      </div>
      </div>
      

    );
  }
}
