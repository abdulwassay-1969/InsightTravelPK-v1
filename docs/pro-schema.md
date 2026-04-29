# PakVista Pro - Supabase Schema Plan

This document outlines the planned tables for the B2B Pro dashboard.
No tables are created yet; this is documentation only.

## 1) agencies
- id (uuid, primary key)
- name (text, not null)
- country (text, not null)
- plan (text, not null) // starter, pro, enterprise
- created_at (timestamptz, default now())

## 2) suppliers
- id (uuid, primary key)
- name (text, not null)
- type (text, not null) // hotel, guide, transport, activity, etc
- region (text, not null)
- verified (boolean, default false)
- contact_public (text)
- contact_private (text)
- languages (text[])
- pricing_tier (text)

## 3) routes
- id (uuid, primary key)
- name (text, not null)
- from (text, not null)
- to (text, not null)
- status (text, not null) // open, restricted, closed, seasonal
- last_updated (timestamptz, default now())
- notes (text)

## 4) permits
- id (uuid, primary key)
- name (text, not null)
- issuing_body (text, not null)
- processing_days (text, not null)
- cost (text)
- required_for (text)

## 5) packages
- id (uuid, primary key)
- agency_id (uuid, references agencies(id), not null)
- title (text, not null)
- destination (text, not null)
- duration (int, not null)
- itinerary_json (jsonb, not null)
- created_at (timestamptz, default now())
