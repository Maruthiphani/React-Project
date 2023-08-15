using CRUDwithWebAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;

namespace CRUDwithWebAPI.Data
{
    public class MyappDbContext : DbContext
    {
        public MyappDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Products> Products { get; set; }
    }

}
