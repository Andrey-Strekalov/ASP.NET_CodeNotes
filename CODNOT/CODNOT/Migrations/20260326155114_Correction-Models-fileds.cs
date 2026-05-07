using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CODNOT.Migrations
{
    /// <inheritdoc />
    public partial class CorrectionModelsfileds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Notes_Deadline",
                table: "Notes");

            migrationBuilder.DropIndex(
                name: "IX_Notes_Status",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "Deadline",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Notes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Deadline",
                table: "Notes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Notes",
                type: "TEXT",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_Deadline",
                table: "Notes",
                column: "Deadline");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_Status",
                table: "Notes",
                column: "Status");
        }
    }
}
