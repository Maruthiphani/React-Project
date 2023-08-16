import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { variabales } from './Variables';


export class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Products: [],
      modalTitle:"",
      productName: "",
      price:0,
      quantity:0,
      modifiedBy: "",   
      createdBy :"",
      createdDate:null,   
      modifiedDate: null,  
      IsActive: false,    
      filteredProducts:[], 
    };
  }

            refreshList() {
              fetch(variabales.API_URL + 'Dapper')
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then((data) => {
                  this.setState({ Products: data });
                })
                .catch((error) => {
                  console.error('Error fetching data:', error);
                  // Handle the error, e.g., set state to show an error message or retry the request.
                });
            }

            componentDidMount() {
              this.refreshList();
            }



          changeProductName = (e) => {
              this.setState({productName:e.target.value});
              }

            changePrice = (e) => {
                this.setState({price:e.target.value});
                }
            changeQuantity = (e) => {
                  this.setState({quantity:e.target.value});
                  }
            changeCreatedBy = (e) => {
                    this.setState({createdBy:e.target.value});
                    }
            changeCreatedDate = (date) => {
              this.setState({ createdDate: date });
            };

            
          
            changeModifiedBY = (e) => {
                        this.setState({modifiedBy:e.target.value});
                        };
            changeModifiedDate = (date) => {
                          this.setState({ modifiedDate: date });
                        };
              
            changeIsActive = (e) => {
                        this.setState({isActive:e.target.value});
                        }

            handleChange = (e) => {
              const { name, value } = e.target;
              this.setState({ [name]: value });
            };

  
            
            editClick(pro){
              this.setState({
                modalTitle: "Edit Product",
                productId:pro.productId,
                productName:pro.productName,
                price:pro.price,
                quantity:pro.quantity,
                createdBy:pro.createdBy,
                createdDate:pro.createdDate,
                modifiedBy:pro.modifiedBy,
                modifiedDate:pro.modifiedDate,
                isActive:pro.isActive
              });
            }

            addClick(){
              this.setState({
                modalTitle: "Add Product",
                productId:0,
                productName:"",
                price:0,
                quantity:0,
                createdBy:"",
                createdDate:null,
                modifiedBy:"",
                modifiedDate:null,
                isActive:false
              });
            }

            creatClick() {
              // Convert the string 'true' or 'false' to a boolean value
              const isActiveBoolean = this.state.isActive === "true";
            
              const data = {
                productId: this.state.productId,
                productName: this.state.productName,
                price: this.state.price,
                quantity: parseInt(this.state.quantity, 10),
                createdBy: this.state.createdBy,
                createdDate: this.state.createdDate,
                modifiedBy: this.state.modifiedBy,
                modifiedDate: this.state.modifiedDate,
                isActive: isActiveBoolean, // Use the converted boolean value
              };
            
              if (!this.state.productName || !this.state.price || !this.state.quantity || !this.state.createdBy || !this.state.createdDate) {
                alert("Please fill in all mandatory fields.");
                return;
              }


              fetch(variabales.API_URL + 'Dapper', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              })
              .then(res => res.json())
              .then(result => {
                alert("Product created successfully");
                this.refreshList();
              })
              .catch(error => {
                console.error('Error creating product:', error);
                alert('Failed to create product');
              });
            }
            

            updateClick(){

            if (!this.state.productName || !this.state.price || !this.state.quantity || !this.state.modifiedBy || !this.state.modifiedDate) {
              alert("Please fill in all mandatory fields.");
              return;
            }
            
            const isActiveBoolean = this.state.isActive === "true";

            fetch(variabales.API_URL + 'Dapper',{
              method:'PUT',
              headers:{
                'Accept':'application/json',
                'Content-Type':'application/json' 
              },
              body:JSON.stringify({
                productId:this.state.productId,
                productName:this.state.productName,
                price:this.state.price,
                quantity:this.state.quantity,
                createdBy:this.state.createdBy,
                createdDate:this.state.createdDate,
                modifiedBy:this.state.modifiedBy,
                modifiedDate:this.state.modifiedDate,
                isActive:isActiveBoolean
              })
            })
            .then(res=>res.json())
            .then((result)=>{
            alert("Product updated successfully");
              this.refreshList();
            },(error)=>{
              alert('Failed');
            })
            
            }


            deleteClick(id){

            fetch(variabales.API_URL + 'Dapper/'+id,{
              method:'DELETE',
              headers:{
                'Accept':'application/json',
                'Content-Type':'application/json' 
              }
            })
            .then(res=>res.json())
            .then((result)=>{
              alert("Product deleted successfully");
              this.refreshList();
            },(error)=>{
              alert('Failed');
            })
            
            }

            handleSearchInputChange = (event) => {
            const searchQuery = event.target.value;
            const filteredProducts = this.filterProducts(searchQuery); // Implement this function
            this.setState({
              searchQuery,
              filteredProducts,
            });
            };


          filterProducts = (searchQuery) => {
            return this.state.Products.filter((pro) =>
              pro.productName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            };

          handleSearchInputChange1 = (event) => {
              const searchQuery1 = event.target.value;
              const filteredProducts = this.filterCreatedBy(searchQuery1); // Implement this function
              this.setState({
                searchQuery1,
                filteredProducts,
              });
              };

          filterCreatedBy = (searchQuery1) => {
                return this.state.Products.filter((pro) =>
                  pro.createdBy.toLowerCase().includes(searchQuery1.toLowerCase())
                );
            };

            handleSearchInputChange2 = (event) => {
              const searchQuery2 = event.target.value;
              const filteredProducts = this.filterPrice(searchQuery2); // Implement this function
              this.setState({
                searchQuery2,
                filteredProducts,
              });
              };

              filterPrice = (searchQuery2) => {
                return this.state.Products.filter((pro) =>
                  pro.price.toString().includes(searchQuery2)
                );
              };
              


        render() {
          const { Products, modalTitle, productName,price, quantity, createdBy, createdDate, modifiedBy, modifiedDate,  isActive, searchQuery, filteredProducts, searchQuery1, searchQuery2 } = this.state;

 
        return (
          <div>
            
          <button type="button"
            className="btn btn-primary m-2 float-end"
            data-bs-toggle="modal"
            data-bs-target="#CreateModal"
            onClick={()=>this.addClick()}
            > Add Product</button>

            <input
              type="text"
              placeholder="Search by Product Name"
              value={searchQuery}
              onChange={this.handleSearchInputChange}
            />
              
            <input
              type="text"
              placeholder="Search by  Created By"
              value={searchQuery1}
              onChange={this.handleSearchInputChange1}
            />

            <input
              type="number"
              placeholder="Search by  Price"
              value={searchQuery2}
              onChange={this.handleSearchInputChange2}
            />

            <table className='table table-striped'>
              <thead>
                <tr>
                  <th>Product Id</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Created By</th>
                  <th>Created Date</th>
                  <th>Modified By</th>
                  <th>Modified Date</th>
                  <th>IsActive</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
              {((searchQuery === '' || !searchQuery)&&(searchQuery1 === '' || !searchQuery1) &&(searchQuery2 === '' || !searchQuery2)) ? (
      Products.map((pro) => (
        <tr key={pro.productId}>
                    <td>{pro.productId}</td>
                    <td>{pro.productName}</td>
                    <td>{pro.price}</td>
                    <td>{pro.quantity}</td>
                    <td>{pro.createdBy}</td>
                    <td>
                      {pro.createdDate
                      ? new Date(pro.createdDate).toLocaleString()
                      : '' }
                    </td>
                    <td>{pro.modifiedBy}</td>
                    <td>
                      {pro.modifiedDate
                      ? new Date(pro.modifiedDate).toLocaleString()
                      : '' }
                    </td>
                    <td>{pro.isActive ? 'Yes' : 'No'}</td>
                    <td>
                    <button type="button" className="btn btn-light m-1"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={()=>this.editClick(pro)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                    </button>
                    <button type="button" className="btn btn-light m-1"
                    onClick={()=>this.deleteClick(pro.productId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                    </button>
                    </td>
                  </tr>
      ))
    ) : (
      filteredProducts.length > 0 ? (
        filteredProducts.map((pro) => (
          <tr key={pro.productId}>
                    <td>{pro.productId}</td>
                    <td>{pro.productName}</td>
                    <td>{pro.price}</td>
                    <td>{pro.quantity}</td>
                    <td>{pro.createdBy}</td>
                    <td>
                      {pro.createdDate
                      ? new Date(pro.createdDate).toLocaleString()
                      : '' }
                    </td>
                    <td>{pro.modifiedBy}</td>
                    <td>
                      {pro.modifiedDate
                      ? new Date(pro.modifiedDate).toLocaleString()
                      : '' }
                    </td>
                    <td>{pro.isActive ? 'Yes' : 'No'}</td>
                    <td>
                    <button type="button" className="btn btn-light m-1"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={()=>this.editClick(pro)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                    </button>
                    <button type="button" className="btn btn-light m-1"
                    onClick={()=>this.deleteClick(pro.productId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                    </button>
                    </td>
                  </tr>
        ))
      ) : (
        <tr>
          <td colSpan="10">No matching records found.</td>
        </tr>
      )
    )}

              </tbody>
            </table>

          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

            <div className="modal-body">
              <div className="input-group mb-3">
                <span className="input-group-text">Product Name</span>
                <input
                  type="text"
                  className="form-control"
                  value={productName} 
                  onChange={this.changeProductName}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Price</span>
                <input
                  type="text"
                  className="form-control"
                  value={price} 
                  onChange={this.changePrice}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Quantity</span>
                <input
                  type="text"
                  className="form-control"
                  value={quantity} 
                  onChange={this.changeQuantity}
                />
              </div>
              <div className="input-group mb-3" style={{ display: 'none' }}>
                <span className="input-group-text">createdBy</span>
                <input
                  type="text"
                  className="form-control"
                  value={createdBy} 
                  onChange={this.changeCreatedBy}
                />
              </div>
              <div className="input-group mb-3" style={{ display: 'none' }}>
                <span className="input-group-text">createdDate</span>
                <DatePicker
                  selected={createdDate === null ? null : new Date(createdDate)}
                  className="form-control"
                  onChange={this.changeCreatedDate}
                  showTimeSelect
                  timeFormat="HH:mm:ss"
                  timeIntervals={1}
                  timeCaption="Time"
                  dateFormat="M/d/yyyy h:mm:ss aa"
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">modifiedBy</span>
                <input
                  type="text"
                  className="form-control"
                  value={modifiedBy === null ? '' : modifiedBy}
                  onChange={this.changeModifiedBY}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">modifiedDate</span>
                <DatePicker
                  selected={modifiedDate === null ? null : new Date(modifiedDate)}
                  className="form-control"
                  onChange={this.changeModifiedDate}
                  showTimeSelect
                  timeFormat="HH:mm:ss"
                  timeIntervals={1}
                  timeCaption="Time"
                  dateFormat="M/d/yyyy h:mm:ss aa"
                />
              </div>


              <div className="input-group mb-3">
                <span className="input-group-text">IsActive</span>
                <input
                  type="text"
                  className="form-control"
                  value={isActive} 
                  onChange={this.changeIsActive}
                />
              </div>
        
                    
                  {this.setState.productId!==0? 
                    <button type="button"
                    className="btn btn-primary float-start"
                    onClick={()=>this.updateClick()}
                    >Update</button>
                    :null}  
            </div>
          
              </div>
              </div>
              </div>


            <div className="modal fade" id="CreateModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

            <div className="modal-body">
              <div className="input-group mb-3">
                <span className="input-group-text">Product Name</span>
                <input
                  type="text"
                  className="form-control"
                  value={productName} 
                  onChange={this.changeProductName}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Price</span>
                <input
                  type="number" // Change the type to "number" to accept decimal input
                  className="form-control"
                  value={price}
                  onChange={this.changePrice}
                  step="0.01" // Set the step attribute to allow two decimal places
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Quantity</span>
                <input
                  type="text"
                  className="form-control"
                  value={quantity} 
                  onChange={this.changeQuantity}
                />
              </div>
              <div className="input-group mb-3" >
                <span className="input-group-text">createdBy</span>
                <input
                  type="text"
                  className="form-control"
                  value={createdBy} 
                  onChange={this.changeCreatedBy}
                />
              </div>
              <div className="input-group mb-3" >
                <span className="input-group-text">createdDate</span>
                <DatePicker
                  selected={createdDate === null ? null : new Date(createdDate)}
                  className="form-control"
                  onChange={this.changeCreatedDate}
                  showTimeSelect
                  timeFormat="HH:mm:ss"
                  timeIntervals={1}
                  timeCaption="Time"
                  dateFormat="M/d/yyyy h:mm:ss aa"
                />
              </div>
              <div className="input-group mb-3" style={{ display: 'none' }}>
                <span className="input-group-text">modifiedBy</span>
                <input
                  type="text"
                  className="form-control"
                  value={modifiedBy === null ? '' : modifiedBy}
                  onChange={this.changeModifiedBY}
                />
              </div>
              <div className="input-group mb-3" style={{ display: 'none' }}>
                <span className="input-group-text">modifiedDate</span>
                <DatePicker
                  selected={modifiedDate === null ? null : new Date(modifiedDate)}
                  className="form-control"
                  onChange={this.changeModifiedDate}
                  showTimeSelect
                  timeFormat="HH:mm:ss"
                  timeIntervals={1}
                  timeCaption="Time"
                  dateFormat="M/d/yyyy h:mm:ss aa"
                />
              </div>


              <div className="input-group mb-3">
                <span className="input-group-text">IsActive</span>
                <input
                  type="text"
                  className="form-control"
                  value={isActive} 
                  onChange={this.changeIsActive}
                />
              </div>
              {this.setState.productId!==0? 
                    <button type="button"
                    className="btn btn-primary float-start"
                    onClick={()=>this.creatClick()}
                    >Create</button>
                    :null}  
                    

                  
            </div>
          
              </div>
              </div>
              </div>
              
          </div>
        );
            }
  }
