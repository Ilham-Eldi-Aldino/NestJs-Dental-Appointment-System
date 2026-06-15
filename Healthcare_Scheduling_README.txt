Healthcare Scheduling App README

A microservice-based healthcare scheduling backend built with NestJS,
GraphQL, Prisma, PostgreSQL, JWT authentication, and Docker.

Services - auth-service (Port 3001) - schedule-service (Port 3002) -
PostgreSQL (Port 5432)

Features - GraphQL API - JWT Authentication - Customer CRUD - Doctor
CRUD - Schedule CRUD - Dockerized deployment - Prisma migrations

Run: docker compose build docker compose up -d

GraphQL: http://localhost:3001/graphql http://localhost:3002/graphql

Status: - Auth Service: Done - Schedule Service: Done - Docker Runtime:
Done - Prisma Migrations: Done - GraphQL Testing: Done
