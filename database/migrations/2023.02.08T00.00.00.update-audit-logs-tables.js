const tables = {
    auditLogs: {
      fq: ["audit_logs_created_by_id_fk", "audit_logs_updated_by_id_fk"],
      indexes: ["audit_logs_created_by_id_fk", "audit_logs_updated_by_id_fk"],
      tableOld: "audit_logs",
      tableNew: "strapi_audit_logs",
    },
    auditLogsUser: {
      fq: ["audit_logs_user_links_fk", "audit_logs_user_links_inv_fk"],
      indexes: ["audit_logs_user_links_fk", "audit_logs_user_links_inv_fk"],
      tableOld: "audit_logs_user_links",
      tableNew: "strapi_audit_logs_user_links",
    },
  };
  
  module.exports = {
    async up(knex) {
      // Drop all of the schema entries we cache
      await knex.from("strapi_database_schema").delete();
  
      // Rename the auditLog table
      if (await knex.schema.hasTable(tables.auditLogs.tableOld)) {
        await knex.schema.renameTable(
          tables.auditLogs.tableOld,
          tables.auditLogs.tableNew
        );
      }
  
      // Rename the auditLogUser table
      if (await knex.schema.hasTable(tables.auditLogsUser.tableOld)) {
        await knex.schema.renameTable(
          tables.auditLogsUser.tableOld,
          tables.auditLogsUser.tableNew
        );
      }
  
      try {
        // Drop the auditLog table fq and indexes
        for (const fq of tables.auditLogs.fq) {
          await knex.schema.alterTable(tables.auditLogs.tableNew, (table) => {
            table.dropForeign([], fq);
          });
        }
  
        for (const index of tables.auditLogs.indexes) {
          await knex.schema.alterTable(tables.auditLogs.tableNew, (table) => {
            table.dropIndex([], index);
          });
        }
  
        // Drop the auditLogUser table fq and indexes
        for (const fq of tables.auditLogsUser.fq) {
          await knex.schema.alterTable(tables.auditLogsUser.tableNew, (table) => {
            table.dropForeign([], fq);
          });
        }
  
        for (const index of tables.auditLogsUser.indexes) {
          await knex.schema.alterTable(tables.auditLogsUser.tableNew, (table) => {
            table.dropIndex([], index);
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  };