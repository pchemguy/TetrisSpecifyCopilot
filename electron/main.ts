import { app } from 'electron';

async function bootstrap(): Promise<void> {
  await app.whenReady();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Window creation is added in the desktop shell implementation task.
});

void bootstrap();