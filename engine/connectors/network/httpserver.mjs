/** --------------------------------------------------------------------------
*
*            / \
*          / _ \               (°°)       Intelligent
*        / ___ \ [ \ [ \  [ \ [   ]       Programmable
*     _/ /   \ \_\  \/\ \/ /  |  | \      Personal
* (_)|____| |____|\__/\__/  [_| |_] \     Assistant
*
* This file is open-source under the conditions contained in the
* license file located at the root of this project.
* Please support the project: https://patreon.com/francoislionet
*
* ----------------------------------------------------------------------------
* @file httpserver.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Connector opening a HTTP server on the machine
*        to receive / send data and serve the interface.
*/
import ConnectorBase from '../../connector.mjs'
import { SERVERCOMMANDS } from '../../servercommands.mjs'
import Awi from '../../awi.mjs'
import express from 'express'
import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import chokidar from 'chokidar'

export { ConnectorHttpServer as Connector }

class ConnectorHttpServer extends ConnectorBase
{
    constructor( awi, config = {} )
    {
        super( awi, config );
		this.name = 'HTTP Server';
		this.token = 'httpServer';
		this.className = 'ConnectorHttpServer';
		this.group = 'network';
		this.version = '0.5';
        this.editors = {};
        
        // Express app and server instances
        this.app = null;
		this.httpServer = null;
		this.httpsServer = null;
		this.watcher = null;        
    }
    
    async connect( options )
    {
        super.connect( options );
        
        // Default configuration
        this.serverConfig = {
            port: options.port || 3000,
            httpsPort: options.httpsPort || 3443,
            rootDirectory: options.rootDirectory || './public',
            enableHttps: options.enableHttps || false,
            httpsOptions: options.httpsOptions || {
                key: '',
                cert: ''
            },
            cors: options.cors !== undefined ? options.cors : true,
            watchFiles: options.watchFiles !== undefined ? options.watchFiles : true,
            watchOptions: options.watchOptions || {
                ignored: /(^|[\/\\])\./, // ignore dotfiles
                ignoreInitial: true
            }
        };
        
        try {
            // Create Express app
            this.app = express();
            
            // Apply middleware
            if (this.serverConfig.cors) {
                this.app.use(cors());
            }
            
            // Basic security headers
            this.app.use(helmet({
                contentSecurityPolicy: false, // Disabled for development, enable in production
                frameguard: false // Disable X-Frame-Options to allow embedding in iframes
            }));
            
            // Serve static files from root directory with proper MIME types
            const rootDir = path.resolve(this.serverConfig.rootDirectory);
            this.app.use(express.static(rootDir, {
                setHeaders: (res, path) => {
                    // Handle Vite asset files with proper MIME types
                    if (path.endsWith('.css')) {
                        res.setHeader('Content-Type', 'text/css');
                    } else if (path.endsWith('.js')) {
                        res.setHeader('Content-Type', 'application/javascript');
                    } else if (path.match(/\.(jpe?g|png|gif|svg|webp)$/i)) {
                        const ext = path.split('.').pop().toLowerCase();
                        const mimeTypes = {
                            'jpg': 'image/jpeg',
                            'jpeg': 'image/jpeg',
                            'png': 'image/png',
                            'gif': 'image/gif',
                            'svg': 'image/svg+xml',
                            'webp': 'image/webp'
                        };
                        if (mimeTypes[ext]) {
                            res.setHeader('Content-Type', mimeTypes[ext]);
                        }
                    }
                }
            }));
            
            // Create HTTP server
            this.httpServer = http.createServer(this.app);
            
            // Start file watcher if enabled
            if (this.serverConfig.watchFiles) {
                this.setupFileWatcher();
            }
            
            // Handle SPA routing (for Vite and other modern frameworks)
            // Send all non-API requests to index.html
            this.app.use((req, res, next) => {
                // Skip API routes or actual files
                if (req.url.startsWith('/api') || req.url.includes('.')) {
                    return next();
                }
                
                // Skip URLs with protocols that might cause path-to-regexp errors
                if (req.url.includes('://')) {
                    return res.status(400).send('Invalid URL format');
                }
                
                const indexPath = path.join(rootDir, 'index.html');
                if (fs.existsSync(indexPath)) {
                    return res.sendFile(indexPath);
                }
                next();
            });
            
            // Start HTTP server
            this.httpServer.listen(this.serverConfig.port, () => {                    
                this.awi.editor.print( `awi:server-start`, { name: 'HTTP server', port: this.serverConfig.port } );
            });
            
            // Start HTTPS server if enabled
            if (this.serverConfig.enableHttps && 
                this.serverConfig.httpsOptions.key && 
                this.serverConfig.httpsOptions.cert) {
                
                const httpsOptions = {
                    key: fs.readFileSync(this.serverConfig.httpsOptions.key),
                    cert: fs.readFileSync(this.serverConfig.httpsOptions.cert)
                };
                
                this.httpsServer = https.createServer(httpsOptions, this.app);
                
                this.httpsServer.listen(this.serverConfig.httpsPort, () => {
                    this.awi.editor.print( `awi:server-start`, { name: 'HTTPS server', port: this.serverConfig.httpsPort, user: 'awi' } );
                });
            }
            
            return this.setConnected(true);
            
        } catch (error) {
            this.awi.editor.print( `awi:server-error`, { name: 'HTTP server', port: this.serverConfig.port, user: 'awi' } );
            return this.setConnected(false);
        }
    }
       
    setupFileWatcher() {
        const rootDir = path.resolve(this.serverConfig.rootDirectory);
        
        this.watcher = chokidar.watch(rootDir, this.serverConfig.watchOptions);
        
        // File change events
        const handleChange = (filePath) => {
            this.notifyClientsOfChange(filePath);
        };
        
        this.watcher.on('change', handleChange);
        this.watcher.on('add', handleChange);
        this.watcher.on('unlink', handleChange);
    }
    
    notifyClientsOfChange(filePath) {
		if ( this.awi.editor.current.sendMessage )
			this.awi.editor.current.sendMessage(SERVERCOMMANDS.RELOAD_FILE, { path: filePath });
	}
    
    // Get server instance for external use
    getExpressApp() {
        return this.app;
    }
    
    getHttpServer() {
        return this.httpServer;
    }
    
    getHttpsServer() {
        return this.httpsServer;
    }
    
    async quit(options)
    {
        super.quit(options);
        
        try {
            // Close file watcher
            if (this.watcher) {
                await this.watcher.close();
                this.watcher = null;
            }
            
            // Close HTTP server
            if (this.httpServer) {
                await new Promise((resolve) => {
                    this.httpServer.close(() => {
                        resolve();
                    });
                });
                this.httpServer = null;
            }
            
            // Close HTTPS server
            if (this.httpsServer) {
                await new Promise((resolve) => {
                    this.httpsServer.close(() => {
                        resolve();
                    });
                });
                this.httpsServer = null;
            }
            
            return this.setConnected(false);
            
        } catch (error) {
            return this.setConnected(false);
        }
    }

    // Exposed functions
    getPort( argsIn )
    {
        return this.serverConfig.port;
    }
    getRootDirectory( argsIn )
    {
        return this.serverConfig.rootDirectory;
    }
}
