using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CRUDwithWebAPI.Data;
using CRUDwithWebAPI.Models;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.AspNetCore.Cors;
using System.Data.SqlClient;
using Dapper;

namespace CRUDwithWebAPI.Controllers
{
    //[ApiController]
    //[Route("api/[controller]")]
    [ApiController]
    [Route("[controller]")]


    public class ProductController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ProductController(IConfiguration config)
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
                var product = await connection.QueryFirstAsync<Products>("select * from products where ProductId = @ProductId", new { ProductId = Id });
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

                bool isDuplicateProductName = await connection.ExecuteScalarAsync<bool>(
                   "SELECT CASE WHEN EXISTS (SELECT 1 FROM products WHERE ProductId <> @ProductId AND ProductName = @ProductName) THEN 1 ELSE 0 END",
                   new { product.ProductId, product.ProductName });

                if (isDuplicateProductName)
                {
                    return BadRequest($"Product with the name '{product.ProductName}' already exists");
                }


                await connection.ExecuteAsync("insert into products (productName, price, quantity, createdBy, createdDate, modifiedBy, modifiedDate, isActive) values (@ProductName, @Price, @Quantity, @CreatedBy, @CreatedDate, @ModifiedBy, @ModifiedDate, @IsActive)", product);
                return Ok(await SelectAllProducts(connection));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

         private static async Task<IEnumerable<Products>> SelectAllProducts(SqlConnection connection)
        {
            return await connection.QueryAsync<Products>("select * from products");
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

                // Check if a product with the same name already exists, excluding the current product being updated
                bool isDuplicateProductName = await connection.ExecuteScalarAsync<bool>(
                    "SELECT CASE WHEN EXISTS (SELECT 1 FROM products WHERE ProductId <> @ProductId AND ProductName = @ProductName) THEN 1 ELSE 0 END",
                    new { product.ProductId, product.ProductName });

                if (isDuplicateProductName)
                {
                    return BadRequest($"Product with the name '{product.ProductName}' already exists");
                }

                // Perform the update
                await connection.ExecuteAsync(
                    "UPDATE products SET ProductName=@ProductName, Price=@Price, Quantity=@Quantity, CreatedBy=@CreatedBy, CreatedDate=@CreatedDate, ModifiedBy=@ModifiedBy, ModifiedDate=@ModifiedDate, IsActive=@IsActive WHERE ProductId = @ProductId",
                    product);

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
                var product = await connection.ExecuteAsync("Delete from products where ProductId = @ProductId", new { ProductId = Id });
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
