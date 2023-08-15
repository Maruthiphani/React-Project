using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using CRUDwithWebAPI.Data;
using CRUDwithWebAPI.Models;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.AspNetCore.Cors;
using System.Data.SqlClient;
using Dapper;
using System.Data;

namespace CRUDwithWebAPI.Controllers
{
    //[Route("api/[controller]/[action]")]
    //[ApiController]
    [ApiController]
    [Route("[controller]")]
    public class DapperController : ControllerBase
    {

        private readonly IConfiguration _config;

        public DapperController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<List<Products>>> GetAllProduct()
        {
            try
            {
                using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                IEnumerable<Products> products = await SelectAllProducts(connection);

                if (!products.Any())
                {
                    return NotFound("Products not available");
                }
                return Ok(products);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("{Id}")]

        public async Task<ActionResult<List<Products>>> GetProductDeatils(int Id)
        {
            try
            {
                using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                //var product = await connection.QueryFirstAsync<Products>("select * from products where ProductId = @ProductId", new { ProductId = Id });

                var parameters = new DynamicParameters();
                parameters.Add("@ProductId", Id);


                var product = await connection.QueryFirstAsync<Products>("sp_getProductDetailsById", parameters,commandType: CommandType.StoredProcedure);


                return Ok(product);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }


        [HttpPost]

        public async Task<ActionResult<List<Products>>> CreateProduct(Products product)
        {
            try
            {
                using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

                var parameters = new DynamicParameters();
                parameters.Add("@ProductName", product.ProductName);
                parameters.Add("@Price", product.Price);
                parameters.Add("@Quantity", product.Quantity);
                parameters.Add("@CreatedBy", product.CreatedBy);
                parameters.Add("@CreatedDate", product.CreatedDate);
                parameters.Add("@IsActive", product.IsActive);

                int  isDuplicateProductName = await connection.ExecuteAsync("sp_insertProduct", parameters, commandType: CommandType.StoredProcedure);


                //var parameters1 = new DynamicParameters();
                //parameters1.Add("@ProductId", product.ProductId);
                //parameters1.Add("@ProductName", product.ProductName);

                //bool isDuplicateProductName = await connection.ExecuteScalarAsync<bool>(
                //   "sp_checkDuplicateProduct",parameters1,commandType: CommandType.StoredProcedure);


                if (isDuplicateProductName == -1)
                {
                    return BadRequest($"Product with the name '{product.ProductName}' already exists");
                }
               

                // Call the stored procedure using DynamicParameters
                

                //await connection.ExecuteAsync("insert into products (productName, price, quantity, createdBy, createdDate, modifiedBy, modifiedDate, isActive) values (@ProductName, @Price, @Quantity, @CreatedBy, @CreatedDate, @ModifiedBy, @ModifiedDate, @IsActive)", product);
                //await connection.ExecuteAsync("sp_insertProduct", product);


                return Ok(await SelectAllProducts(connection));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        private static async Task<IEnumerable<Products>> SelectAllProducts(SqlConnection connection)
        {
            return await connection.QueryAsync<Products>("sp_getAllProductsDetails");
        }

        [HttpPut]
        public async Task<ActionResult<List<Products>>> EditProduct(Products product)
        {
            if (product == null || product.ProductId == 0)
            {
                if (product == null)
                {
                    return BadRequest("model data is invalid");
                }
                else if (product.ProductId == 0)
                {
                    return BadRequest($"Product Id {product.ProductId} is invalid");
                }
            }

            try
            {
                using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

                var parameters = new DynamicParameters();
                
                parameters.Add("@ProductId", product.ProductId);
                parameters.Add("@ProductName", product.ProductName);
                parameters.Add("@ProductId", product.ProductId);
                parameters.Add("@Price", product.Price);
                parameters.Add("@Quantity", product.Quantity);
                parameters.Add("@ModifiedBy", product.ModifiedBy);
                parameters.Add("@ModifiedDate", product.ModifiedDate);
                parameters.Add("IsActive", product.IsActive);

                int isDuplicateProductName = await connection.ExecuteAsync("sp_updateProduct", parameters, commandType: CommandType.StoredProcedure);

                if (isDuplicateProductName == -1)
                {
                    return BadRequest($"Product with the name '{product.ProductName}' already exists");
                }

                // Perform the update
                //await connection.ExecuteAsync(
                //    "UPDATE products SET ProductName=@ProductName, Price=@Price, Quantity=@Quantity, CreatedBy=@CreatedBy, CreatedDate=@CreatedDate, ModifiedBy=@ModifiedBy, ModifiedDate=@ModifiedDate, IsActive=@IsActive WHERE ProductId = @ProductId",
                //    product);
              


                

                return Ok(await SelectAllProducts(connection));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("{Id}")]

        public async Task<ActionResult<List<Products>>> Delete(int Id)
        {
            try
            {

                using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                //var product = await connection.ExecuteAsync("Delete from products where ProductId = @ProductId", new { ProductId = Id });

                var parameters = new DynamicParameters();
                parameters.Add("ProductId", Id);

                var product = await connection.ExecuteAsync("sp_delete", parameters, commandType: CommandType.StoredProcedure);
                if (product == 0)
                {
                    return NotFound("Record not found");
                }
                return Ok(await SelectAllProducts(connection));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




    }
}
