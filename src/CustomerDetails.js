import React, { Component} from 'react';
import { variabales } from './Variables';
import { v4 as uuidv4 } from 'uuid';



// The rest of your code...


export class CustomerDetails extends Component{

   constructor(props) {
        super(props);
    
        this.state = {
          Customers: [],
          modalData:[],
          modalTitle:"",
          customerId:0,
          customerName: "",
          customerAddress:"",
          CustomerAddress:"",
          CustomerName:"",
          Quantity: 0,
          TotalPrice:0,
          ItemId:0,
          MRPPrice:0,
          ItemName:"",
          StoreLocation: "",
          editedGuid: null,
          isDeleted:0,
          defaultValues: [
            { name: "Iphone 15", price: 90000.0 },
            { name: "Ipad", price: 100001.0 },
            { name: "SamsungSmartWatch", price: 89001.0 },
            { name: "Air Cooler", price: 79001.00 },
            { name: "SmartWaterBottle", price: 90000.00},
            { name: "WasherAndDryer", price: 79001.00 },
            { name: "Drone", price: 112000.00 },
            { name: "5DCamera", price: 890001.00 },
            { name: "ElectricCar", price: 6300000.00},
            { name: "WaterProof5DCamera", price: 214000.00 },
            { name: "ESlate", price: 134700.00 },
            
          ],
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
            this.setState({ Customers: data });
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            // Handle the error, e.g., set state to show an error message or retry the request.
          });
      }
    
      componentDidMount() {
        this.refreshList();
      }

      
        editClick(cus) {
            fetch(variabales.API_URL + 'Customer/' + cus.customerId, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              }
            })
            .then((response) => response.json())
            .then((data) => {
                const dataArray = data.map((item) => ({
                  ...item,
                  Guid: uuidv4(), // Generate a unique GUID for each item
                }));
              
                this.setState({
                  modalTitle: "Edit Customer",
                  customerId: cus.customerId,
                  customerName:cus.customerName,
                  customerAddress:cus.customerAddress,
                  modalData: dataArray, // Set the entire JSON data with GUIDs
                });
            })
            .catch((error) => {
              console.error("Error fetching customer data:", error);
            });
          }
          
        
        
        handleDynamicQuantityChange = (event, index) => {
            const { value } = event.target;
            const { modalData } = this.state;
          
            const itemIndex = modalData.findIndex(item => item.Guid === index);
            
            if (itemIndex !== -1) {
              const updatedModalData = [...modalData];
              const selectedMRP = updatedModalData[itemIndex].mrpPrice || "";
              updatedModalData[itemIndex].quantity = parseInt(value, 10);
              updatedModalData[itemIndex].totalPrice = selectedMRP * parseInt(value, 10);
          
              this.setState({ modalData: updatedModalData });
            }
          };
          
        handleEditClick = (guid) => {
            this.setState({ editedGuid: guid });
          };

          
        
        
        handleItemNameChange = (event, guid) => {
            const { value } = event.target;
            const { modalData, defaultValues } = this.state;
          
            const selectedEntry = defaultValues.find(entry => entry.name === value);
            const updatedModalData = modalData.map(item =>
              item.Guid === guid
                ? { ...item, itemName: value, mrpPrice: selectedEntry ? selectedEntry.price : 0 }
                : item
            );
          
            this.setState({ modalData: updatedModalData });
          };
          

        handleAddRow = () => {
            const newGuid = uuidv4();
          
            const newRow = {
              Guid: newGuid,
              itemName: "",
              mrpPrice: 0,
              quantity: 0,
              totalPrice: 0,
              isExisting: 0,
              isDeleted: 0,
              disableToggle: true,
            };
          
            this.setState(prevState => ({
              modalData: [...prevState.modalData, newRow],
            }));
          };


      
          
        handleUpdateClick = () => {

          fetch(variabales.API_URL + 'Customer', {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                customerId: this.state.customerId,
                customerName: this.state.customerName,
                customerAddress: this.state.customerAddress,
                ItemsData: this.state.modalData.map((item) => ({
                  PurchaseItemId: item.purchaseItemId, // Assuming you have a PurchaseItemId field
                  ItemId:item.ItemId,
                  ItemName: item.itemName,
                  Quantity: item.quantity,
                  MrpPrice: item.mrpPrice,
                  TotalPrice: item.totalPrice,
                  isDeleted: item.isDeleted === 1 ? true : false, 
                  // Other fields you want to update
                })),
                StoreLocation: ""  // You can set the StoreLocation here
              })
            })
            .then(res => res.json())
            .then(result => {
              alert("Customer Items updated successfully");
              this.refreshList();
            })
            .catch(error => {
              alert('Failed to update Customer');
            });
          }
          

        handleDeleteToggleClick = (guid) => {
            this.setState((prevState) => ({
              modalData: prevState.modalData.map((item) =>
                item.Guid === guid ? { ...item, isDeleted: item.isDeleted === 1 ? 0 :  1 } : item
              )
            }));
          };
          

        handleAddClick = () => {

        
              

            fetch(variabales.API_URL + 'Customer', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                customerId: this.state.customerId,
                customerName: this.state.CustomerName,
                customerAddress: this.state.CustomerAddress,
                ItemsData: this.state.modalData.map((item) => ({
                  PurchaseItemId: item.purchaseItemId, // Assuming you have a PurchaseItemId field
                  ItemId:item.ItemId,
                  ItemName: item.itemName,
                  Quantity: item.quantity,
                  MrpPrice: item.mrpPrice,
                  TotalPrice: item.totalPrice,
                 isDeleted: item.isDeleted === 1 ? true : false,
                  // Other fields you want to update
                })),
                StoreLocation: "" // You can set the StoreLocation here
              })
            })
            .then(res => res.json())
            .then(result => {
              alert("Customer Inserted updated successfully");
              this.refreshList();
            })
            .catch(error => {
              alert('Failed to update Customer');
            });
          }


        handleCustomerAddressChange = (event) => {
  
            const newName = event.target.value;
        
            
            this.setState({
              CustomerAddress: newName,
              
            });
          };


        handleCustomerNameChange = (event) => {
   
            const newName = event.target.value;
            this.setState({
              CustomerName: newName,
              
            });
          };

        addClick() {
            
              this.setState({
                modalData: [],
               });
            };
          

        handleRemoveRow = (guid) => {
                this.setState((prevState) => ({
                  modalData: prevState.modalData.filter((item) => item.Guid !== guid),
                }));
              };
              

        handleAddRow1 = () => {
                const newGuid = uuidv4();
              
                const newRow = {
                  Guid: newGuid,
                  itemName: "",
                  mrpPrice: 0,
                  quantity: 0,
                  totalPrice: 0,
                  isExisting: 0,
                  isDeleted: 0,
                  disableToggle: true,
                };
              
                this.setState({ editedGuid: newGuid });

                this.setState(prevState => ({
                  modalData: [...prevState.modalData, newRow],
                }));
              };
    
    
      render() {
        const { Customers, customerId, customerName, customerAddress, modalData, Quantity,TotalPrice,ItemId,MRPPrice,ItemName, modalTitle, editedGuid,  defaultValues,CustomerName,CustomerAddress} = this.state;


         return ( 
           <div>
           <button type="button"
            className="btn btn-primary m-2 float-end"
            data-bs-toggle="modal"
            data-bs-target="#CreateModal"
            onClick={()=>this.addClick()}
           > Add Customer</button>

          <table className='table table-striped'>
            <thead>
              <tr>
                <th style={{ display: 'none' }}>Customer Id</th>
                <th>Customer Name</th>
                <th>Customer Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Customers.map((cus) => (
                <tr key={cus.customerId}>
                  <td style={{ display: 'none' }}>{cus.customerId}</td>
                  <td>{cus.customerName}</td>
                  <td>{cus.customerAddress}</td>
                  <td>
                  <button type="button" className="btn btn-light m-1"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={()=>this.editClick(cus)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
                </button>
                 </td>
                </tr>
              ))}
            </tbody>
          </table>
          
      
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>

             <div style={{ marginBottom: '20px' }}>
                <label htmlFor="CustomerName" style={{ marginRight: '17px' }}>Customer Name:</label>
                <input type="text" name="CustomerName" value={customerName} readOnly />
            </div>


            <div>
                <label htmlFor="CustomerAddress" style={{ marginRight: '17px' }}>Customer Address:</label>
                <input type="text" name="CustomerAddress" value={customerAddress} readOnly />
            </div>



            <div>
            <button
            type="button"
            style={{ marginRight: '10px' }}
            className="btn btn-primary m-2 float-end"
            onClick={this.handleAddRow}
             >
            Add Item
        </button>
            </div>


             <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th style={{ display: 'none' }}>isExisting</th> 
                  <th style={{ display: 'none' }}>isDeleted</th> 
                </tr>
              </thead>
              <tbody>
          {modalData.map((item) => (
            <tr key={item.Guid}>
             <td>
                {editedGuid === item.Guid ? (
                    <select
                    value={item.itemName}
                    onChange={(e) => this.handleItemNameChange(e, item.Guid)}
                    >
                    {modalData.map((entry, index) => (
                        <option key={index} value={entry.itemName}>
                        {entry.itemName}
                        </option>
                    ))}
                    {defaultValues.map((entry, index) => (
                        <option key={index} value={entry.name}>
                        {entry.name}
                        </option>
                    ))}
                    </select>
                ) : (
                    <span>{item.itemName}</span>
                )}
            </td>
           <td>{item.mrpPrice}</td>
              <td>
                {editedGuid === item.Guid ? (
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => this.handleDynamicQuantityChange(e, item.Guid)}
                  />
                ) : (
                  <span>{item.quantity}</span>
                )}
              </td>
              <td>{item.totalPrice}</td>
              <td style={{ display: 'none' }}>1</td>
              <td style={{ display: 'none' }}>0</td>
              <td>
                <button
                  type="button"
                  className="btn btn-light m-1"
                  onClick={() => this.handleEditClick(item.Guid)}
                >
                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>

                </button>
                <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id={`toggleSwitch${item.Guid}`}
              checked={item.isDeleted === 1 ? true : false}
              disabled={item.disableToggle}
              onChange={() => this.handleDeleteToggleClick(item.Guid)}
            />
            <label className="form-check-label" htmlFor={`toggleSwitch${item.Guid}`}>
              DELETE
            </label>
          </div>
              </td>
            </tr>
          ))}
        </tbody>
             </table>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
                type="button"
                style={{ marginInline: '1px' }}
                className="btn btn-primary m-2"
                onClick={this.handleUpdateClick}>
                Update
            </button>
           
            </div>



        </div>
          </div>
          </div>
             
          <div className="modal fade" id="CreateModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{"Create CustomerDetails"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>

             <div style={{ marginBottom: '20px' }}>
             <label htmlFor="CustomerName" style={{ marginRight: '17px' }}>Customer Name:</label>
                  <input type="text" name="CustomerName" value={CustomerName} onChange={this.handleCustomerNameChange} />
                </div>

                <div>
                <label htmlFor="CustomerAddress" style={{ marginRight: '17px' }}>Customer Address:</label>
                  <input type="text" name="CustomerAddress" value={CustomerAddress} onChange={this.handleCustomerAddressChange} />
            </div>

            <div>
            <button
            type="button"
            style={{ marginRight: '10px' }}
            className="btn btn-primary m-2 float-end"
            onClick={this.handleAddRow1}
             >
            Add Item
        </button>
            </div>


             <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th style={{ display: 'none' }}>isExisting</th> 
                  <th style={{ display: 'none' }}>isDeleted</th> 
                </tr>
              </thead>
              <tbody>
                
              {modalData.map((item) => (
                <tr key={item.Guid}>
                  <td>
                        {editedGuid === item.Guid ? (
                            <select
                            value={item.itemName}
                            onChange={(e) => this.handleItemNameChange(e, item.Guid)}
                            >
                            {modalData.map((entry, index) => (
                                <option key={index} value={entry.itemName}>
                                {entry.itemName}
                                </option>
                            ))}
                            {defaultValues.map((entry, index) => (
                                <option key={index} value={entry.name}>
                                {entry.name}
                                </option>
                            ))}
                            </select>
                        ) : (
                            <span>{item.itemName}</span>
                        )}
                    </td>
                 <td>{item.mrpPrice}</td>
                    <td>
                    {editedGuid === item.Guid ? (
                        <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => this.handleDynamicQuantityChange(e, item.Guid)}
                        className={item.quantity === 0 ? "empty-field" : ""}
                        />
                    ) : (
                        <span>{item.quantity}</span>
                    )}
                    </td>
                    <td>{item.totalPrice}</td>
                    <td style={{ display: 'none' }}>1</td>
                    <td style={{ display: 'none' }}>0</td>
                    <td>
                {/* <button
                  type="button"
                  className="btn btn-light m-1"
                  onClick={() => this.handleEditClick(item.Guid)}
                >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>

                </button> */}
                <button type="button" className="btn btn-light m-1"
                onClick={()=>this.handleRemoveRow(item.Guid)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                </svg>
                </button>     
              </td>
                </tr>
                ))}

        </tbody>
             </table>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
                type="button"
                style={{ marginInline: '1px' }}
                className="btn btn-primary m-2"
                onClick={this.handleAddClick}
               >
                Insert Customer
            </button>
           </div>



        </div>
        </div>
          </div>

          </div>
        );
    
    
    }

}



