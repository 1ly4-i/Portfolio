use ishikaev_coursework

--CREATE TABLE Клиент (
--	[Номер клиента] INT PRIMARY KEY IDENTITY,
--	ФИО NVARCHAR(50),
--	Телефон NVARCHAR(15),
--	[E-mail] NVARCHAR(50),
--	Адрес NVARCHAR(50)
--	--Telephone constraint done in C# (on user interface level)
--);

--CREATE TABLE Сотрудник (
--	[Номер сотрудника] INT PRIMARY KEY IDENTITY,
--	ФИО NVARCHAR(50),
--	Должность NVARCHAR(30),
--	Логин NVARCHAR(20),
--	Пароль NVARCHAR(20)
--);

--CREATE TABLE Категория (
--	[Номер категории] INT PRIMARY KEY IDENTITY,
--	Категория NVARCHAR(30)
--);

--CREATE TABLE Поставщик (
--	[Номер поставщика] INT PRIMARY KEY IDENTITY,
--	Название NVARCHAR(30),
--	[E-mail] NVARCHAR(50),
--	Телефон NVARCHAR(15)
--	--Telephone constraint done in C# (on user interface level)
--);

--CREATE TABLE Товар (
--	[Номер товара] INT PRIMARY KEY IDENTITY,
--	[Номер категории] INT,
--	Название NVARCHAR(50),
--	Количество INT,
--	Цена MONEY,

--	FOREIGN KEY ([Номер категории]) REFERENCES Категория([Номер категории])
--);

--CREATE TABLE Поставка (
--	[Номер поставки] INT PRIMARY KEY IDENTITY,
--	[Номер поставщика] INT,
--	[Номер товара] INT,
--	Количество INT,
--	Дата DATETIME DEFAULT GETDATE(),
	
--	FOREIGN KEY ([Номер поставщика]) REFERENCES Поставщик([Номер поставщика]),
--	FOREIGN KEY ([Номер товара]) REFERENCES Товар([Номер товара])
--);

--CREATE TABLE Заказ (
--	[Номер заказа] INT PRIMARY KEY IDENTITY,
--	[Номер товара] INT,
--	[Номер клиента] INT,
--	[Номер сотрудника] INT,
--	Количество INT,
--	Стоимость MONEY,
--	Дата DATETIME DEFAULT GETDATE(),

--	FOREIGN KEY ([Номер товара]) REFERENCES Товар([Номер товара]),
--	FOREIGN KEY ([Номер клиента]) REFERENCES Клиент([Номер клиента]),
--	FOREIGN KEY ([Номер сотрудника]) REFERENCES Сотрудник([Номер сотрудника])
--);

--GO
--CREATE PROCEDURE SalesProfit
--AS
--SELECT Сотрудник.ФИО, Сотрудник.Должность, COUNT(Заказ.Стоимость) AS [Сумма продаж]
--	FROM Сотрудник INNER JOIN Заказ ON Сотрудник.[Номер сотрудника] = Заказ.[Номер сотрудника]
--	WHERE Сотрудник.Должность = 'Продавец'
--	GROUP BY Сотрудник.ФИО, Сотрудник.Должность
--	ORDER BY [Сумма продаж] DESC

GO
CREATE TRIGGER costing ON Заказ
AFTER UPDATE
AS
UPDATE Заказ (
	SET Стоимость = Количество * (SELECT Цена FROM Товар WHERE Номер Товара = Заказ.[Номер товара]);
)