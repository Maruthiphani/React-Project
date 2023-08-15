using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore.SqlServer;


namespace CRUDwithWebAPI.Models
{
    public class Customers
    {
        public int CustomerId { get; set; }

        [Required]
        public string CustomerName { get; set; }

        [Required]
        public string CustomerAddress { get; set; }

        [Required]
        public string ItemName { get; set; }

        [Required]
        public decimal MRPPrice { get; set; }

        [Required]
         public int Quantity { get; set; }

        public string StoreLocation { get; set; }

        [Required]
        public decimal TotalPrice { get; set; }

        

    }


    public class Items
    {

        public int CustomerId { get; set; }
        [Required]
        public string CustomerName { get; set; }

        [Required]
        public string CustomerAddress { get; set; }

        public List<ItemData> ItemsData { get; set; }

        
        

        public string StoreLocation { get; set; }

        


        public class ItemData
        {
            [Required]
            public string ItemName { get; set; }

            [Required]
            public decimal MRPPrice { get; set; }

            [Required]
            public int Quantity { get; set; }

            [Required]
            public decimal TotalPrice { get; set; }

            public int PurchaseItemId { get; set; }

            public bool isDeleted { get; set; }
        }

    }


    
}

    
