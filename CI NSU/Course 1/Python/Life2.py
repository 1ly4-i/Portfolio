from tkinter import *
import random
import time

root = Tk()
root.geometry('800x680')
n = 20
li = True
stopp = True
sp = 0.5
alive = 0
amalive = Label(text = "кол-во живых клеток: " + str(alive))
iterat = Label(text = "итераций: 0")
turns = 0

var = DoubleVar()
scale = Scale(root, variable = var)
scale.pack(anchor = CENTER)
scale.place(x = 670, y = 10)

def genNew(event):
    global li, stopp, map1, alive, turns
    li = stopp = True
    turns = 0
    for i in range(n):
        for j in range(n):
            map1[i][j] = random.randint(0, 1)
            buttons[i][j]['bg'] = color[map1[i][j]]
            alive += map1[i][j]
    amalive.config(text = "кол-во живых клеток: " + str(alive))
    iterat.config(text = "итераций: " + str(turns))
    root.update()

def click1(event):
    global li, stopp, sp, var, alive, turns
    stopp = False
    while (li) and (not stopp):
        if (var.get() == 0):
            stopp == True
            break
        time.sleep(5 / var.get())
        alive = 0
        for i in range(1, n - 1):
            for j in range(1, n - 1):
                t = map1[i - 1][j - 1] + map1[i - 1][j] + map1[i - 1][j + 1] + map1[i][j - 1] + map1[i][j + 1] + map1[i + 1][j - 1] + map1[i + 1][j] + map1[i + 1][j + 1]
                if (map1[i][j] == 0) and (t == 3):
                    map2[i][j] = 1
                if map1[i][j] == 1 and (t == 2 or t == 3):
                    map2[i][j] = 1
        li = False
        for i in range(n):
            for j in range(n):
                if (not li) and (map1[i][j] != map2[i][j]):
                    li = True
                map1[i][j] = map2[i][j]
                map2[i][j] = 0
                alive += map1[i][j]
                buttons[i][j]['bg'] = color[map1[i][j]]
        turns += 1
        amalive.config(text = "кол-во живых клеток: " + str(alive))
        iterat.config(text = "итераций: " + str(turns))
        root.update()

def click2(event):
    global stopp
    stopp = True

but1 = Button(root, text = '   Старт   ')
but1.bind('<Button-1>', click1)
but1.place(x = 600, y = 10)

but2 = Button(root, text = '   Стоп   ')
but2.bind('<Button-1>', click2)
but2.place(x = 600, y = 40)

but3 = Button(root, text = '   Новая   ')
but3.bind('<Button-1>', genNew)
but3.place(x = 600, y = 70)

amalive.place(x = 600, y = 120)
iterat.place(x = 600, y = 140)

color = ["white", "black"]

map1 = [[random.randint(0,1) for i in range (n)] for j in range (n)]
map2 = [[0 for i in range (n)] for j in range (n)]
buttons = []

for i in range(n):
    buttons.append([])
    for j in range(n):
        button = Button(root, width = 2, height = 1, bg = color[map1[i][j]])
        buttons[i].append(button)
        buttons[i][j].grid(row = i, column = j)

root.mainloop()
