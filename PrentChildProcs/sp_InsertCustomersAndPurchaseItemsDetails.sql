CREATE PROCEDURE sp_InsertCustomersAndPurchaseItemsDetails
    @CustomerName varchar(50),
    @CustomerAddress varchar(50),
    @ItemData NVARCHAR(MAX),
    @StoreLocation varchar(100)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CustomerId int;

    INSERT INTO CutomersTable (CustomerName, CustomerAddress, CreatedBy, CreatedDate, IsActive)
    VALUES (@CustomerName, @CustomerAddress, 'maruthi', GETDATE(), 1);

    SET @CustomerId = SCOPE_IDENTITY();

    INSERT INTO PurchaseItems (DateOfPurchase, ItemId, Quantity, TotalPrice, CustomerID, StoreLocation, CreatedBy, CreatedDate, IsActive)
    SELECT 
        GETDATE(), 
        ItemDetails.ItemId, 
        ItemInfo.Quantity, 
        ItemInfo.TotalPrice, 
        @CustomerId, 
        @StoreLocation, 
        'maruthi', 
        GETDATE(), 
        1
    FROM OPENJSON(@ItemData)
    WITH (
        ItemName varchar(50),
        MRPPrice Decimal(10, 2),
        Quantity int,
        TotalPrice Decimal(10, 2)
    ) AS ItemInfo
    INNER JOIN ItemDetails ON ItemInfo.ItemName = ItemDetails.ItemName;

    SELECT @CustomerId AS CustomerId;
END
GO

DECLARE @CustomerId int;
DECLARE @ItemData NVARCHAR(MAX) = '[
    {
        "ItemName": "Air Cooler",
        "MRPPrice": 79001.00,
        "Quantity": 3,
        "TotalPrice": 237003.00
    },
    {
        "ItemName": "Drone",
        "MRPPrice": 112000.00,
        "Quantity": 1,
        "TotalPrice": 112000.00
    }
]';

EXEC sp_InsertCustomersAndPurchaseItemsDetails
    @CustomerName = 'Maruthi',
    @CustomerAddress = '487 Main St',
    @ItemData = @ItemData,
    @StoreLocation = '';