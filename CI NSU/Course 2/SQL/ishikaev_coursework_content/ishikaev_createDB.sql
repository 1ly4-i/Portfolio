use ishikaev_coursework

--CREATE TABLE ������ (
--	[����� �������] INT PRIMARY KEY IDENTITY,
--	��� NVARCHAR(50),
--	������� NVARCHAR(15),
--	[E-mail] NVARCHAR(50),
--	����� NVARCHAR(50)
--	--Telephone constraint done in C# (on user interface level)
--);

--CREATE TABLE ��������� (
--	[����� ����������] INT PRIMARY KEY IDENTITY,
--	��� NVARCHAR(50),
--	��������� NVARCHAR(30),
--	����� NVARCHAR(20),
--	������ NVARCHAR(20)
--);

--CREATE TABLE ��������� (
--	[����� ���������] INT PRIMARY KEY IDENTITY,
--	��������� NVARCHAR(30)
--);

--CREATE TABLE ��������� (
--	[����� ����������] INT PRIMARY KEY IDENTITY,
--	�������� NVARCHAR(30),
--	[E-mail] NVARCHAR(50),
--	������� NVARCHAR(15)
--	--Telephone constraint done in C# (on user interface level)
--);

--CREATE TABLE ����� (
--	[����� ������] INT PRIMARY KEY IDENTITY,
--	[����� ���������] INT,
--	�������� NVARCHAR(50),
--	���������� INT,
--	���� MONEY,

--	FOREIGN KEY ([����� ���������]) REFERENCES ���������([����� ���������])
--);

--CREATE TABLE �������� (
--	[����� ��������] INT PRIMARY KEY IDENTITY,
--	[����� ����������] INT,
--	[����� ������] INT,
--	���������� INT,
--	���� DATETIME DEFAULT GETDATE(),
	
--	FOREIGN KEY ([����� ����������]) REFERENCES ���������([����� ����������]),
--	FOREIGN KEY ([����� ������]) REFERENCES �����([����� ������])
--);

--CREATE TABLE ����� (
--	[����� ������] INT PRIMARY KEY IDENTITY,
--	[����� ������] INT,
--	[����� �������] INT,
--	[����� ����������] INT,
--	���������� INT,
--	��������� MONEY,
--	���� DATETIME DEFAULT GETDATE(),

--	FOREIGN KEY ([����� ������]) REFERENCES �����([����� ������]),
--	FOREIGN KEY ([����� �������]) REFERENCES ������([����� �������]),
--	FOREIGN KEY ([����� ����������]) REFERENCES ���������([����� ����������])
--);

--GO
--CREATE PROCEDURE SalesProfit
--AS
--SELECT ���������.���, ���������.���������, COUNT(�����.���������) AS [����� ������]
--	FROM ��������� INNER JOIN ����� ON ���������.[����� ����������] = �����.[����� ����������]
--	WHERE ���������.��������� = '��������'
--	GROUP BY ���������.���, ���������.���������
--	ORDER BY [����� ������] DESC

GO
CREATE TRIGGER costing ON �����
AFTER UPDATE
AS
UPDATE ����� (
	SET ��������� = ���������� * (SELECT ���� FROM ����� WHERE ����� ������ = �����.[����� ������]);
)