using CRUDwithWebAPI.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Data.SqlClient;
using static CRUDwithWebAPI.Models.Items;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace CRUDwithWebAPI.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    [ApiController]
    [Route("[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly IConfiguration _config;

        public CustomerController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<List<Customers>>> GetAllitemNamesAndMRPPrices()
        {

            using var conection = new SqlConnection(_config.GetConnectionString("Defaultconnection"));

            IEnumerable<Customers> customers = await SelectAllCustomerDetails(conection);

            if (!customers.Any())
            {
                return NotFound("Products not available");
            }
            return Ok(customers);

        }

        private static async Task<IEnumerable<Customers>> SelectAllCustomerDetails(SqlConnection conection)
        {
            return await conection.QueryAsync<Customers>("sp_GetCustomerDetails", commandType: System.Data.CommandType.StoredProcedure);
        }


        [HttpPost]

        public async Task<ActionResult<List<Items>>> InsertCustomerAndItemDetails(Items item)
            {
            try
            {
                using var connection = new SqlConnection(_config.GetConnectionString("Defaultconnection"));

                var parameters = new DynamicParameters();
                //parameters.Add("@CustomerId", item.CustomerId);
                parameters.Add("@CustomerName", item.CustomerName);
                parameters.Add("@CustomerAddress", item.CustomerAddress);
                parameters.Add("@StoreLocation", item.StoreLocation);

                // Serialize the ItemsDate list to JSON
                string itemsDateJson = JsonConvert.SerializeObject(item.ItemsData);

                List<JObject> itemsData = JsonConvert.DeserializeObject<List<JObject>>(itemsDateJson);

                // Remove the "PurchaseItemId" attribute with a value of 0 from each object
                foreach (var item1 in itemsData)
                {
                    if (item1["PurchaseItemId"] != null && item1["PurchaseItemId"].Value<int>() == 0)
                    {
                        item1.Remove("PurchaseItemId");
                    }
                }

                // Serialize the modified list back into a JSON string
                string modifiedJson = JsonConvert.SerializeObject(itemsData, Formatting.Indented);

                parameters.Add("@ItemData", modifiedJson);

                int rowsAffected = await connection.ExecuteAsync("sp_InsertCustomersAndPurchaseItemsDetails", parameters, commandType: CommandType.StoredProcedure);

                // Handle the rowsAffected value appropriately based on your specific requirements.

                return Ok("Record(s) inserted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut]

        public async Task<ActionResult<List<Items>>> EditCustomerDetials(Items item)
        {
            try
            {
                using var connection = new SqlConnection(_config.GetConnectionString("Defaultconnection"));

                var parameters = new DynamicParameters();
                parameters.Add("@CustomerID", item.CustomerId);
                parameters.Add("@StoreLocation", item.StoreLocation);
                string itemsDateJson = JsonConvert.SerializeObject(item.ItemsData);

                List<JObject> itemsData = JsonConvert.DeserializeObject<List<JObject>>(itemsDateJson);

                // Remove the "PurchaseItemId" attribute with a value of 0 from each object
                foreach (var item1 in itemsData)
                {
                    if (item1["PurchaseItemId"] != null && item1["PurchaseItemId"].Value<int>() == 0)
                    {
                        item1.Remove("PurchaseItemId");
                    }
                }

                // Serialize the modified list back into a JSON string
                string modifiedJson = JsonConvert.SerializeObject(itemsData, Formatting.Indented);

                parameters.Add("@ItemsData", modifiedJson); 

                int rowsAffected = await connection.ExecuteAsync("sp_UpdateAndInsertPurchaseItemForCustomer", parameters, commandType: CommandType.StoredProcedure);

                

                return Ok("Record(s) inserted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }



        [HttpGet("{Id}")]
        public async Task<ActionResult<List<Customers>>> UpdateCustomer(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("Defaultconnection"));

            
            var parameters = new DynamicParameters();
            parameters.Add("@CustomerId", Id);
            //var result = connection.Query<ItemDate>("sp_GetUpdatedCustomerDetails", parameters, commandType: CommandType.StoredProcedure);
            IEnumerable<ItemData> result = connection.Query<ItemData>("sp_GetUpdatedCustomerDetails", parameters, commandType: CommandType.StoredProcedure);



            return Ok(result);
        }



    }
}

// CustomerName,CustomerAddress,ItemName,MRPPrice,Quantity,StoreLocation

//[HttpPut]

//public async Task<ActionResult<List<Items>>> EditCustomerDetials(Items item)
//{
//    try
//    {
//        using var connection = new SqlConnection(_config.GetConnectionString("Defaultconnection"));

//        var parameters = new DynamicParameters();
//        parameters.Add("@CustomerID", item.CustomerId);
//        //parameters.Add("@CustomerName", item.CustomerName);
//        //parameters.Add("@CustomerAddress", item.CustomerAddress);
//        parameters.Add("@StoreLocation", item.StoreLocation);


//             // Serialize the ItemsDate list to JSON
//        string itemsDateJson = JsonConvert.SerializeObject(item.ItemsData);
//        parameters.Add("@ItemsData", itemsDateJson); // Add JSON data as a parameter


//         int rowsAffected = await connection.ExecuteAsync("sp_UpdatePurchaseItemForCustomer", parameters, commandType: CommandType.StoredProcedure);
//        //int rowsAffected = await connection.ExecuteAsync("sp_UpdateAndInsertPurchaseItemForCustomer", parameters, commandType: CommandType.StoredProcedure);

//        // Handle the rowsAffected value appropriately based on your specific requirements.

//        return Ok("Record(s) inserted successfully");
//    }
//    catch (Exception ex)
//    {
//        return BadRequest(ex);
//    }
//}