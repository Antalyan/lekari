# PB138-Lekari

## About project

This project was implemented as a final project of PB138: Markup Languages course of Masaryk University, Faculty of Informatics. 

The project team consists of four people, most of whom chosen the course purely optionally because of their interested in web technologies.

## Project description

The application provides a reservation hub for patients who would like to attend doctors, including authentication.

Official topic description:

_The system should be able to display a list of doctors, filter by city of operation and by doctor's specialty. When detailing the doctor, it displays contact information, office hours and a booking calendar. The user can add his reservation to the reservation calendar. In order to make a reservation, a person must fill in the name, surname and contact information, or must be logged in._

## Team

Project team members and their main responsibilities: 

- **Michael Koudela** (frontend development)
- **Ondřej Lošťák** (backend development)
- **Richard Pánek** (backend development)
- **Vendula Teuchnerová** (graphical design)

## Technology

There are two separate projects in the repository (frontend and backend).

**Frontend**: React (with Typescript), MUI, Recoil 

**Backend**: Typescript, Prisma, Sqlite

## Getting started in Webstorm

1. Open project: Get from VCS -> *https://gitlab.fi.muni.cz/xkoudel2/pb138-lekari.git*
2. In terminal, type *cd .\frontend\* or *cd .\backend\* to get to the corresponding subproject (or use *tab* to find the correct folder)
3. Type *npm i* in the project subfolder
4. Run the application via terminal command *npm run start* 
OR use webstorm Run (follow these steps to set up if not available by default):

    4.1. Go to Run -> Edit Configurations (on the top)

    4.2. Click on plus button to add a new configuration

    4.3 Choose npm

    4.4 Fill in the fields: Name = *any name of the configuration you want*, package.json = *choose path to fronted/backend package.json file*, Command = run, Scripts = start (backend), startPc (backend)
    
    4.5 From now on, you can always run the app in a standard way

5. Configure database using command: *npx prisma migrate dev --name db_init*

![img.png](webstormConfig1.png)
![img_1.png](webstormConfig2.png)

If prisma was not installed before:
$ npm i prisma
$ npx prisma generate


