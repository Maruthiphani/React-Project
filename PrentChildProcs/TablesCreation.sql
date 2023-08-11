
Create table CutomersTable(
CustomerId int identity(1,1) primary key,
CustomerName varchar(50) not null,
CustomerAddress varchar(50) not null,
CreatedBy varchar(50) not null,
CreatedDate DateTime not null,
ModifiedBy varchar(50),
ModifiedDate DateTime,
IsActive BIT, 
);

CREATE TABLE PurchaseItems (
  PurchaseItemId INT IDENTITY(1,1) PRIMARY KEY,
  DateOfPurchase DATETIME NOT NULL,
  ItemId INT,
  Quantity INT NOT NULL,
  TotalPrice DECIMAL(10, 2) NOT NULL,
  CustomerID INT,
  StoreLocation VARCHAR(100),
  CreatedBy VARCHAR(50) NOT NULL,
  CreatedDate DATETIME NOT NULL,
  ModifiedBy VARCHAR(50),
  ModifiedDate DATETIME,
  IsActive BIT,
  FOREIGN KEY (CustomerID) REFERENCES CutomerTable(CustomerId),
  FOREIGN KEY (ItemId) REFERENCES ItemDetails(ItemId)
);

select * from PurchaseItems
select * from CutomersTable
select * from ItemDetails

USE ParentchildCRUD;
-- to find the foreign key constraint
--SELECT name, type_desc
--FROM sys.objects
--WHERE parent_object_id = OBJECT_ID('PurchaseItem');

--ALTER TABLE PurchaseItem
--DROP CONSTRAINT FK__PurchaseI__Custo__403A8C7D;

--ALTER TABLE PurchaseItem
--ADD CONSTRAINT FK__PurchaseI__Custo__403A8C7D
--FOREIGN KEY (CustomerID) REFERENCES CutomerTable(CustomerId)
--ON DELETE CASCADE;




-- Delete a single record based on PurchaseItemId
--DELETE FROM PurchaseItems WHERE PurchaseItemId = 2;

-- Delete all records associated with a specific CustomerID
--DELETE FROM PurchaseItems WHERE CustomerID = YourCustomerID;

-- Delete all records associated with a specific ItemId
--DELETE FROM PurchaseItems WHERE ItemId = YourItemId;

-- Delete all records from the PurchaseItems table
--DELETE FROM PurchaseItems;
