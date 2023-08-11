Alter PROCEDURE sp_UpdateAndInsertPurchaseItemForCustomer
    @CustomerID INT,
    @ItemsData NVARCHAR(MAX), -- JSON array containing item details
    @StoreLocation VARCHAR(100)
AS
BEGIN
    BEGIN TRY
        -- Parsing JSON array into a temporary table
        SELECT * INTO #TempItems FROM OPENJSON(@ItemsData)
        WITH (
            PurchaseItemId INT '$.PurchaseItemId',
            ItemName VARCHAR(50) '$.ItemName',
            Quantity INT '$.Quantity',
            TotalPrice DECIMAL(10, 2) '$.TotalPrice',
            MRPPrice DECIMAL(10, 2) '$.MRPPrice',
            isDeleted BIT '$.isDeleted'
        )

        -- Updating records based on the temporary table
        UPDATE PI
        SET
            ItemId = (SELECT ItemId FROM ItemDetails WHERE ItemName = TI.ItemName),
            Quantity = TI.Quantity,
            TotalPrice = TI.TotalPrice,
            StoreLocation = @StoreLocation,
            ModifiedBy = 'User',
            ModifiedDate = GETDATE()
        FROM PurchaseItems AS PI
        JOIN #TempItems AS TI ON PI.PurchaseItemId = TI.PurchaseItemId
        WHERE
            CustomerID = @CustomerID;

        -- Deleting records based on isDeleted
        DELETE FROM PurchaseItems
        WHERE
            CustomerID = @CustomerID
            AND PurchaseItemId IN (SELECT PurchaseItemId FROM #TempItems WHERE isDeleted = 1);

        -- Inserting new rows with appended PurchaseItemId
        INSERT INTO PurchaseItems (DateOfPurchase, ItemId, Quantity, TotalPrice, CustomerID, StoreLocation, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate, IsActive)
        SELECT
            GETDATE(),
            (SELECT ItemId FROM ItemDetails WHERE ItemName = TI.ItemName),
            TI.Quantity,
            TI.TotalPrice,
            @CustomerID,
            @StoreLocation,
            'User',
            GETDATE(),
            'User', 
            GETDATE(),
            1
        FROM #TempItems AS TI
        WHERE TI.PurchaseItemId IS NULL;

        DROP TABLE #TempItems;

        RETURN 0; -- Successful execution
    END TRY
    BEGIN CATCH
        RETURN 1; -- Error occurred
    END CATCH;
END;